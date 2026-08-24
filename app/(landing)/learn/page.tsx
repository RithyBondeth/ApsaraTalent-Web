import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { LearnContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ស្វែងយល់ — Apsara Talent" : "Learn — Apsara Talent",
    description:
      lang === "km"
        ? "រៀនពីរបៀបប្រើប្រាស់ Apsara Talent ឲ្យបានពេញលេញ — មគ្គុទ្ទេសក៍ វីដេអូណែនាំ និងធនធានសម្រាប់អ្នកស្វែងរកការងារ និងនិយោជក។"
        : "Learn how to get the most out of Apsara Talent — guides, tutorials, and resources for job seekers and employers.",
  };
}

export default async function LearnPage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <LearnContent sessionRole={sessionRole} />;
}
