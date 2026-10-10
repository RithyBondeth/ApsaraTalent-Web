import { NextResponse } from "next/server";
import { appleAssociation } from "@/lib/mobile-app-links";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(appleAssociation(), {
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return NextResponse.json(
      { error: "App association is not configured" },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
