import { NextRequest, NextResponse } from "next/server";
import { getRoleFromJwt } from "./utils/functions/auth/get-role-from-jwt";

const protectedRoutes = [
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
const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/login/phone-number",
  "/login/phone-number/phone-otp",
  "/login/email-verification",
];

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("auth-token")?.value ?? "";
    const isAuthenticated = token.length > 0;

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route),
    );

    // If this path is neither auth nor protected, do nothing.
    if (!isAuthRoute && !isProtectedRoute) {
      return NextResponse.next();
    }

    // Unauthenticated users can't access protected routes
    if (!isAuthenticated && isProtectedRoute) {
      const encoded = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encoded}`, request.url),
      );
    }

    if (!isAuthenticated) {
      return NextResponse.next();
    }

    // Token is present; role decoding may fail for malformed/expired tokens.
    // In that case, keep default authenticated behavior without crashing edge runtime.
    const role = getRoleFromJwt(token);

    // If user has token but role is "none", force onboarding
    if (role === "none") {
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/signup/option", request.url));
      }
      return NextResponse.next();
    }

    // Fully authenticated users shouldn't access auth pages
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }

    return NextResponse.next();
  } catch {
    // Never let middleware failures crash production edge function.
    return NextResponse.next();
  }
}

export const config = {
  // Limit middleware to auth/protected app routes only.
  // This avoids running edge logic for static assets and unrelated pages.
  matcher: [
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
