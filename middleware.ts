import { NextRequest, NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

/* ---------------------------------- Helper --------------------------------- */
const PROTECTED_ROUTES = [
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
  try {
    const { pathname } = request.nextUrl;
    const role = request.cookies.get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;
    const isAuthenticated = role !== null;

    const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);
    const isAuthRouteException = isRouteMatch(pathname, AUTH_ROUTE_EXCEPTIONS);
    const isProtectedRoute = isRouteMatch(pathname, PROTECTED_ROUTES);
    const isGuestLandingRoute = isLandingRoute(pathname);

    // If this path is neither auth, protected, nor guest landing, do nothing.
    if (!isAuthRoute && !isProtectedRoute && !isGuestLandingRoute) {
      return NextResponse.next();
    }

    // Unauthenticated users can't access protected routes
    if (!isAuthenticated && isProtectedRoute) {
      const encoded = encodeURIComponent(buildCallbackUrl(request));
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encoded}`, request.url),
      );
    }

    if (!isAuthenticated) {
      return NextResponse.next();
    }

    // If the authenticated user has no selected role, force onboarding.
    if (role === "none") {
      if (isProtectedRoute || isGuestLandingRoute) {
        return NextResponse.redirect(new URL("/signup/option", request.url));
      }
      return NextResponse.next();
    }

    // Fully authenticated users shouldn't access auth or guest landing pages
    if ((isAuthRoute && !isAuthRouteException) || isGuestLandingRoute) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    return NextResponse.next();
  } catch {
    // Never let middleware failures crash production edge function.
    return NextResponse.next();
  }
}

export const config = {
  // Limit middleware to auth/protected/guest landing app routes only.
  // This avoids running edge logic for static assets and unrelated pages.
  matcher: [
    "/",
    "/feed/:path*",
    "/profile/:path*",
    "/favorite/:path*",
    "/search/:path*",
    "/matching/:path*",
    "/message/:path*",
    "/notification/:path*",
    "/resume-builder/:path*",
    "/dashboard/:path*",
    "/interview/:path*",
    "/setting/:path*",
    "/login/:path*",
    "/signup/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
  ],
};
