import type { Metadata } from "next";
import { cookies } from "next/headers";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";
import { TermsContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "លក្ខខណ្ឌនៃការប្រើប្រាស់" : "Terms of Service",
    description:
      lang === "km"
        ? "លក្ខខណ្ឌនៃការប្រើប្រាស់ Apsara Talent"
        : "The rules and guidelines that govern your use of the Apsara Talent platform.",
  };
}

export default async function TermsOfServicePage() {
  // Read on the server so the header renders the right session button on
  // first paint. /privacy and /terms are outside the middleware matcher, so
  // a signed-in reader reaches them and must not be offered a Login button.
  const sessionRole =
    (await cookies()).get(COOKIE_CONFIG.SESSION_ROLE)?.value ?? null;

  return <TermsContent sessionRole={sessionRole} />;
}
