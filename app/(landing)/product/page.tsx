import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ProductContent } from "./_content";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ផលិតផល — Apsara Talent" : "Product — Apsara Talent",
    description:
      "Discover the Apsara Talent platform — mobile apps for iOS & Android, Apsara Agentic AI Assistant, and a powerful web experience.",
  };
}

export default function ProductPage() {
  return <ProductContent />;
}
