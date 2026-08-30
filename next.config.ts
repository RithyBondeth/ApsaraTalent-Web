import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiOrigin = (() => {
  if (!apiUrl) return null;
  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
})();

/**
 * Fail the build rather than ship an app that cannot reach its API.
 *
 * `scripts/check-env.mjs` already lists NEXT_PUBLIC_API_URL as required, and it
 * passes — but it validates the repository's .env files, which is not the same
 * environment the build runs in. `vercel pull` writes
 * `.vercel/.env.production.local`, and that outranks the tracked
 * `.env.production`. So the checked-in value can be a correct absolute URL
 * while the build sees something else entirely.
 *
 * That is not hypothetical. Production shipped with no API origin in the
 * client bundle: NEXT_PUBLIC_* is inlined at build time, so every API call
 * became a path relative to the web origin and 404'd, and `connect-src` lost
 * the API origin at the same moment and for the same reason.
 *
 * This check runs where the build runs, with the merged environment, so the
 * failure is a red build instead of a silently broken deployment.
 */
if (process.env.NODE_ENV === "production" && !apiOrigin) {
  throw new Error(
    "NEXT_PUBLIC_API_URL must be an absolute http(s) URL in a production build.\n" +
      `  received: ${apiUrl === undefined ? "(unset)" : JSON.stringify(apiUrl)}\n` +
      "\n" +
      "It is inlined into the client bundle at build time, so a missing or\n" +
      "relative value makes every API request resolve against the web origin.\n" +
      "It also feeds connect-src in middleware.ts.\n" +
      "\n" +
      "On Vercel this comes from the project's environment variables for the\n" +
      "Production environment, which override the tracked .env.production.",
  );
}

const apiImagePattern = (() => {
  if (!apiUrl) return null;
  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/**",
    };
  } catch {
    return null;
  }
})();

/**
 * The document Content-Security-Policy is NOT here any more — it is built per
 * request in `middleware.ts`, because `script-src` now carries a nonce and a
 * nonce cannot exist in a header evaluated once at build time.
 *
 * Moving it also fixed a bug this file could not avoid: `connect-src` is
 * derived from NEXT_PUBLIC_API_URL, and when that was absent at build time the
 * API origin silently disappeared from the policy. Production was serving
 * `connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io` — no API
 * origin at all.
 *
 * What remains here are the headers that are genuinely static, plus the service
 * worker's own policy below.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR ?? ".next",

  // Strip console.log in production — keeps console.error and console.warn
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  images: {
    domains: [],
    remotePatterns: [
      ...(apiImagePattern ? [apiImagePattern] : []),
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
    // Cache images for 7 days — profile/avatar images rarely change
    minimumCacheTTL: 604800,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"], // Use modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Add headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // The service worker needs a policy of its own, and a different one.
      //
      // `public/firebase-messaging-sw.js` begins with two importScripts calls to
      // https://www.gstatic.com. A worker's imports are governed by the
      // `script-src` delivered with the WORKER script — and the old blanket
      // `source: "/(.*)"` rule handed it `script-src 'self' 'unsafe-inline'`,
      // which does not include gstatic. So the policy this app shipped
      // forbade its own service worker from loading Firebase; background push
      // notifications could not work, and nothing reported it.
      //
      // The worker is excluded from the middleware matcher so this rule is the
      // only policy it receives.
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' https://www.gstatic.com",
              "connect-src 'self' https://*.googleapis.com https://*.google.com",
            ].join("; "),
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

const analyzedConfig = withBundleAnalyzer(nextConfig);
const shouldUploadSentryArtifacts =
  Boolean(process.env.CI) && Boolean(process.env.SENTRY_AUTH_TOKEN);

// Keep local and pull-request builds independent of Sentry. Runtime error
// reporting still comes from the Sentry instrumentation files.
const configuredNext = shouldUploadSentryArtifacts
  ? withSentryConfig(analyzedConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      // Quiet logs unless running in CI.
      silent: !process.env.CI,
      // Upload a wider set of client source maps for better stack traces.
      widenClientFileUpload: true,
      // Proxy browser events through our own domain so ad blockers (which block
      // *.ingest.sentry.io) can't drop them. Path is excluded from middleware.
      tunnelRoute: "/monitoring",
      // Tree-shake Sentry logger statements out of the client bundle.
      disableLogger: true,
    })
  : analyzedConfig;

export default configuredNext;
