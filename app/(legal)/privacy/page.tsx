import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PrivacyContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "គោលការណ៍ភាពឯកជន" : "Privacy Policy",
    description:
      "How Apsara Talent collects, uses, and protects your personal information.",
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
