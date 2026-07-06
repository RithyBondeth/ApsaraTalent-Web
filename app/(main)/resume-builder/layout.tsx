import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "បង្កើត CV ដោយ AI" : "Resume Builder",
    description:
      lang === "km" ? "បង្កើត CV របស់អ្នកដោយ AI" : "Build your resume with AI",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
