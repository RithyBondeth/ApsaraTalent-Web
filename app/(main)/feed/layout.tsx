import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ព័ត៌មានថ្មី" : "Feed",
    description:
      lang === "km" ? "មើលព័ត៌មានថ្មីៗរចុងក្រោយ" : "View the latest news",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
