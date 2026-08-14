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

const GUEST_LANDING_ROUTES = ["/", "/product", "/learn", "/safety", "/support"];

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
    if (isAuthRoute || isGuestLandingRoute) {
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
    "/product/:path*",
    "/learn/:path*",
    "/safety/:path*",
    "/support/:path*",
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
