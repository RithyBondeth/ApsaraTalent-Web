import { NextRequest, NextResponse } from "next/server";
import { getRoleFromJwt } from "./utils/functions/get-role-from-jwt";

const protectedRoutes = [
  "/feed",
  "/profile",
  "/favorite",
  "/search",
  "/matching",
  "/message",
  "/notification",
  "/resume-builder",
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
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = !!token;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // role-aware handling
  if (isAuthenticated && token) {
    const role = getRoleFromJwt(token);

    // If user has token but role is "none", force onboarding
    if (role === "none") {
      // allow signup/login route
      if (isAuthRoute) return NextResponse.next();

      // block protected routes until onboarding completes
      if (isProtectedRoute)
        return NextResponse.redirect(new URL("/signup/option", request.url));

      return NextResponse.next();
    }

    // fully authed users shouldn't access auth routes
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }

  // Unauthenticated users can't access protected routes
  if (!isAuthenticated && isProtectedRoute) {
    const encoded = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encoded}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|icon.svg|api).*)"],
};
