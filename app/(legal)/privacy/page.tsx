import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { PrivacyContent } from "./_content";

/* ------------------------------- Meta Data ------------------------------- */
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

/* ------------------------------- Main Page ------------------------------- */
export default async function PrivacyPolicyPage() {
  /* 
    Read the session role on the server so the header shows the correct
    button on the very first render (no flicker).
    
    Why this matters here: middleware normally handles auth redirects, but
    /privacy and /terms are excluded from it. That means a logged-in user
    can land on this page — so we must NOT show them a "Login" button.
    Reading the cookie here lets us pick the right button up front.
  */
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <PrivacyContent sessionRole={sessionRole} />;
}
