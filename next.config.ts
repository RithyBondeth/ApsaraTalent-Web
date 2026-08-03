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

const connectSources = [
  "'self'",
  "https://*.sentry.io",
  "https://*.ingest.sentry.io",
  ...(apiOrigin
    ? [apiOrigin, apiOrigin.replace(/^http/, "ws")]
    : []),
  ...(process.env.NODE_ENV === "production" ? [] : ["ws:", "wss:"]),
];

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"
  }`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self' data:",
  `connect-src ${connectSources.join(" ")}`,
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(process.env.NODE_ENV === "production"
    ? ["upgrade-insecure-requests"]
    : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
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
