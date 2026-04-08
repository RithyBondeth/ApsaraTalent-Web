import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SupportContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title:
      lang === "km"
        ? "ជំនួយ — Apsara Talent"
        : "Support — Apsara Talent",
    description:
      "Get help with Apsara Talent — FAQs, contact support, and resources to resolve any issues quickly.",
  };
}

export default function SupportPage() {
  return <SupportContent />;
}
