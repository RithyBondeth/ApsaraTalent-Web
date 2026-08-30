import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { SupportContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ជំនួយ — Apsara Talent" : "Support — Apsara Talent",
    description:
      lang === "km"
        ? "ស្វែងរកជំនួយសម្រាប់ Apsara Talent — សំណួរដែលគេសួរញឹកញាប់ ទាក់ទងផ្នែកជំនួយ និងធនធានដើម្បីដោះស្រាយបញ្ហាណាមួយបានលឿន។"
        : "Get help with Apsara Talent — FAQs, contact support, and resources to resolve any issues quickly.",
  };
}

export default async function SupportPage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <SupportContent sessionRole={sessionRole} />;
}
