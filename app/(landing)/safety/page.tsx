import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { SafetyContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title:
      lang === "km" ? "សុវត្ថិភាព — Apsara Talent" : "Safety — Apsara Talent",
    description:
      lang === "km"
        ? "ស្វែងយល់អំពីវិធានការសុវត្ថិភាព ការការពារទិន្នន័យ និងគោលនយោបាយទំនុកចិត្តដែលរក្សាសហគមន៍ Apsara Talent ឱ្យមានសុវត្ថិភាព។"
        : "Learn about the safety measures, data protection, and trust policies that keep the Apsara Talent community secure.",
  };
}

export default async function SafetyPage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <SafetyContent sessionRole={sessionRole} />;
}
