import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { ProductContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ផលិតផល — Apsara Talent" : "Product — Apsara Talent",
    description:
      lang === "km"
        ? "ស្វែងយល់ពីវេទិកា Apsara Talent — កម្មវិធីទូរស័ព្ទសម្រាប់ iOS និង Android, Apsara Agentic AI Assistant, និងបទពិសោធន៍គេហទំព័រដ៏មានឥទ្ធិពល។"
        : "Discover the Apsara Talent platform — mobile apps for iOS & Android, Apsara Agentic AI Assistant, and a powerful web experience.",
  };
}

export default async function ProductPage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <ProductContent sessionRole={sessionRole} />;
}
