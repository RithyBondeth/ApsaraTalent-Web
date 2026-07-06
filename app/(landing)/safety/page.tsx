import type { Metadata } from "next";
import { cookies } from "next/headers";
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

export default function SafetyPage() {
  return <SafetyContent />;
}
