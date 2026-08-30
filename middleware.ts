import { NextRequest, NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

/* ------------------------------ Content-Security-Policy -------------------- */
/**
 * CSP is built here, per request, because `script-src` carries a fresh nonce.
 *
 * It used to live in `next.config.ts` `headers()`, which is evaluated once at
 * BUILD time. That had two consequences worth remembering, because both shipped
 * to production and neither was visible from a green build:
 *
 *  1. `script-src` had to allow `'unsafe-inline'`, which is the one directive
 *     that matters against XSS. A nonce cannot be baked into a static header.
 *  2. `connect-src` is derived from NEXT_PUBLIC_API_URL. When that value was
 *     absent at build time the API origin silently vanished from the policy —
 *     which is exactly what production was serving:
 *       connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io
 *
 * `next.config.ts` now throws during a production build when
 * NEXT_PUBLIC_API_URL is not an absolute URL, so (2) cannot recur silently.
 * (`scripts/check-env.mjs` could not catch it: that validates the repository's
 * .env files, and the value that broke production came from Vercel's own
 * environment, which overrides them.) This module is the belt to that braces —
 * the policy is assembled where the app actually runs.
 *
 * Every route rendering HTML must reach this function — see `config.matcher`.
 */
function buildContentSecurityPolicy(nonce: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiOrigin = (() => {
    if (!apiUrl) return null;
    try {
      return new URL(apiUrl).origin;
    } catch {
      return null;
    }
  })();

  const isProduction = process.env.NODE_ENV === "production";

  const connectSources = [
    "'self'",
    "https://*.sentry.io",
    "https://*.ingest.sentry.io",
    ...(apiOrigin ? [apiOrigin, apiOrigin.replace(/^http/, "ws")] : []),
    ...(isProduction ? [] : ["ws:", "wss:"]),
  ];

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    // The nonce replaces 'unsafe-inline'. 'strict-dynamic' lets the scripts
    // Next.js bootstraps with the nonce load the rest of the chunk graph, which
    // is why no explicit chunk origin is listed. Browsers that honour
    // 'strict-dynamic' ignore 'self' here; it stays for those that do not.
    //
    // 'unsafe-eval' outside production only: the dev overlay and Turbopack
    // need it, production does not.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
      isProduction ? "" : " 'unsafe-eval'"
    }`,
    // 'unsafe-inline' here is deliberate and is NOT the same risk as it was on
    // script-src. Tailwind's arbitrary values, Radix's positioning and the
    // resume builder's computed styles all emit inline style attributes; a
    // nonce cannot cover attributes, only <style> elements. Removing it would
    // break layout across the app for no meaningful XSS reduction.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");
}

/* ---------------------------------- Helper --------------------------------- */
const PROTECTED_ROUTES = [
  "/admin",
  "/feed",
  "/profile",
  "/favorite",
  "/search",
  "/matching",
  "/message",
  "/notification",
  "/resume-builder",
  "/dashboard",
  "/interview",
  "/setting",
];

const AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

/**
 * Only the marketing home. A signed-in person landing on "/" wants the app, so
 * it still redirects to /feed.
 *
 * The informational sub-pages used to be here too, which made them unreachable
 * once you were signed in: the shared landing header links to all four from
 * /privacy and /terms — the two pages a signed-in reader *does* arrive at, via
 * Settings — and every one of those links bounced to /feed. /support carries the
 * FAQ, contact details and mobile-app help, which is exactly what someone with
 * an account needs. They are public, informational and hold no account data, so
 * they are now treated like /privacy and /terms: no redirect either way.
 */
const GUEST_LANDING_ROUTES = ["/"];

/**
 * Auth-prefixed routes an authenticated user still needs.
 *
 * Email verification runs *after* registration, and registration already
 * signs the person in. Without this exception the generic "authenticated
 * users don't belong on /login/*" rule bounces them to /feed at the exact
 * moment the page matters, and — since the mail now carries a code rather
 * than a link — there is no second way back to it.
 */
const AUTH_ROUTE_EXCEPTIONS = ["/login/email-verification"];

/**
 * The admin panel. Gated here so a signed-in employee does not get a flash of
 * the panel's chrome before the API refuses every request behind it.
 *
 * This is presentation only, and must never be mistaken for authorisation: the
 * role comes from a cookie the browser owns and can trivially forge. Every
 * admin endpoint is guarded server-side by AuthGuard + AdminGuard, and a forged
 * cookie buys nothing but an empty page full of failed requests.
 */
const ADMIN_ROUTES = ["/admin"];

function isRouteMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isLandingRoute(pathname: string) {
  return GUEST_LANDING_ROUTES.includes(pathname);
}

function buildCallbackUrl(request: NextRequest) {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export function middleware(request: NextRequest) {
  // Generated before anything can fail, so every exit below — including the
  // catch — returns a response carrying a policy.
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildContentSecurityPolicy(nonce);

  /**
   * Next.js applies the nonce to the <script> tags it renders itself by reading
   * it back off the REQUEST's Content-Security-Policy header, so that header
   * has to be set on the request as well as the response. `x-nonce` is for our
   * own code: a Server Component can read it via `headers()` and pass it to a
   * <Script nonce={...}>.
   *
   * Without the request half, Next's hydration scripts render without a nonce
   * and 'strict-dynamic' blocks the entire bundle — a blank page, not a
   * degraded one.
   */
  const withPolicy = (response: NextResponse) => {
    response.headers.set("Content-Security-Policy", csp);
    return response;
  };

  const nextWithNonce = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
    return withPolicy(
      NextResponse.next({ request: { headers: requestHeaders } }),
    );
  };

  try {
    const { pathname } = request.nextUrl;
    const role = request.cookies.get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;
    const isAuthenticated = role !== null;

    const isAdminRoute = isRouteMatch(pathname, ADMIN_ROUTES);
    const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);
    const isAuthRouteException = isRouteMatch(pathname, AUTH_ROUTE_EXCEPTIONS);
    const isProtectedRoute = isRouteMatch(pathname, PROTECTED_ROUTES);
    const isGuestLandingRoute = isLandingRoute(pathname);

    // If this path is neither auth, protected, nor guest landing, do nothing.
    if (!isAuthRoute && !isProtectedRoute && !isGuestLandingRoute) {
      return nextWithNonce();
    }

    // Unauthenticated users can't access protected routes
    if (!isAuthenticated && isProtectedRoute) {
      const encoded = encodeURIComponent(buildCallbackUrl(request));
      return withPolicy(
        NextResponse.redirect(
          new URL(`/login?callbackUrl=${encoded}`, request.url),
        ),
      );
    }

    if (!isAuthenticated) {
      return nextWithNonce();
    }

    // If the authenticated user has no selected role, force onboarding.
    if (role === "none") {
      if (isProtectedRoute || isGuestLandingRoute) {
        return withPolicy(
          NextResponse.redirect(new URL("/signup/option", request.url)),
        );
      }
      return nextWithNonce();
    }

    // Non-admins are sent to their own home rather than shown a 404: the panel
    // is not a secret, it is simply not theirs.
    if (isAdminRoute && role !== "admin") {
      return withPolicy(NextResponse.redirect(new URL("/feed", request.url)));
    }

    // An admin has no feed, profile, matches or resume — every one of those
    // pages is built around an employee or company profile their role does
    // not have, so the whole signed-in app outside /admin is sent to /admin.
    // The auth routes go too, or the generic redirect below would drop them
    // back on /feed.
    if (
      role === "admin" &&
      !isAdminRoute &&
      (isProtectedRoute || isGuestLandingRoute || isAuthRoute) &&
      !isAuthRouteException
    ) {
      return withPolicy(NextResponse.redirect(new URL("/admin", request.url)));
    }

    // Fully authenticated users shouldn't access auth or guest landing pages
    if ((isAuthRoute && !isAuthRouteException) || isGuestLandingRoute) {
      return withPolicy(NextResponse.redirect(new URL("/feed", request.url)));
    }

    return nextWithNonce();
  } catch {
    // Never let middleware failures crash production edge function.
    return nextWithNonce();
  }
}

export const config = {
  /**
   * Every route that renders HTML, because every one of them now needs a nonce.
   *
   * This used to be an allowlist of the auth, protected and landing routes, on
   * the reasoning that edge logic should not run for anything else. That was
   * right while the middleware only did redirects — but it is now also the only
   * place CSP is produced, and an allowlist would have left /privacy, /terms,
   * /support and the rest of the informational pages with no policy at all.
   * Silently: they would render fine and simply be unprotected.
   *
   * Broadening it does NOT change redirect behaviour. The first branch in
   * `middleware()` returns immediately for any path that is not an auth,
   * protected or guest-landing route, so newly matched paths fall straight
   * through to `nextWithNonce()`.
   *
   * The exclusions, and why each one:
   *   _next/static, _next/image  — assets, not documents; pure edge cost
   *   favicon.ico, *.svg/png/... — same
   *   monitoring                 — Sentry's tunnelRoute (next.config.ts). It
   *                                proxies browser events; adding a document
   *                                policy to it is meaningless and it must stay
   *                                cheap, since it is on the error path.
   *   firebase-messaging-sw.js   — the service worker needs a DIFFERENT policy
   *                                to its own importScripts (see next.config.ts)
   */
  matcher: [
    "/((?!_next/static|_next/image|monitoring|firebase-messaging-sw\\.js|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|txt|xml|webmanifest)$).*)",
  ],
};
