import type { Metadata } from "next";
import { cookies } from "next/headers";
import { TermsContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title:
      lang === "km" ? "លក្ខខណ្ឌនៃការប្រើប្រាស់" : "Terms of Service",
    description:
      "The rules and guidelines that govern your use of the Apsara Talent platform.",
  };
}

export default function TermsOfServicePage() {
  return <TermsContent />;
}
