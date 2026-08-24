import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { PrivacyContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "គោលការណ៍ភាពឯកជន" : "Privacy Policy",
    description:
      lang === "km"
        ? "របៀបដែល Apsara Talent ប្រមូល ប្រើប្រាស់ និងការពារទិន្នន័យផ្ទាល់ខ្លួនរបស់អ្នក។"
        : "How Apsara Talent collects, uses, and protects your personal information.",
  };
}

export default async function PrivacyPolicyPage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <PrivacyContent sessionRole={sessionRole} />;
}
