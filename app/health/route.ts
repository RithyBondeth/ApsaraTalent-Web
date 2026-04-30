import { NextResponse } from "next/server";

export async function GET() {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();

  return NextResponse.json({
    status: "ok",
    service: "apsaratalent-web",
    environment: process.env.NODE_ENV || "development",
    apiBaseUrlConfigured: apiBaseUrl.length > 0,
    timestamp: new Date().toISOString(),
  });
}
