import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ប្រវត្តិរូបអ្នកមានទេពកោសល្យ" : "Talent Profile",
    description:
      lang === "km" ? "ប្រវត្តិរូបអ្នកមានទេពកោសល្យ" : "Talent Profile",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
