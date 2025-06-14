import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/feed', '/profile', '/search/employee', '/search/company', '/matching', '/message', '/notification'];
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Redirect authenticated users away from login pages
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    const encoded = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encoded}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api).*)'], // Optional: exclude static files
};
