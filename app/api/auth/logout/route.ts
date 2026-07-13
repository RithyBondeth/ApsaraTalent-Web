import { NextResponse } from "next/server";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Logged out successfully",
      success: true,
    });

    const isProduction = process.env.NODE_ENV === "production";

    // Clear the auth-token cookie
    response.cookies.set(COOKIE_CONFIG.AUTH_TOKEN, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    // Clear the refresh-token cookie
    response.cookies.set(COOKIE_CONFIG.REFRESH_TOKEN, "", {
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    // Clear the auth-remember cookie
    response.cookies.set("auth-remember", "", {
      expires: new Date(0),
      path: "/",
      httpOnly: false, // Same as when it was set
      secure: isProduction,
      sameSite: "lax", // Match the sameSite used when setting
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
