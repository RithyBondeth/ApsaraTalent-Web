import { NextResponse } from "next/server";

export async function GET() {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const release = (
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GITHUB_SHA ||
    process.env.SENTRY_RELEASE ||
    "unknown"
  ).trim();

  return NextResponse.json({
    status: "ok",
    service: "apsaratalent-web",
    environment: process.env.NODE_ENV || "development",
    release,
    apiBaseUrlConfigured: apiBaseUrl.length > 0,
    timestamp: new Date().toISOString(),
  });
}
