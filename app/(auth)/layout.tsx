import type { Metadata } from "next";
import { cookies } from "next/headers";
import LanguageToggle from "@/components/utils/toggles/language-toggle";
import ThemeToggle from "@/components/utils/toggles/theme-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ចុះឈ្មោះ" : "Registration",
    description:
      lang === "km"
        ? "ចុះឈ្មោះដើម្បីស្វែងរកការងារ ឬ ស្វែងរកបុគ្គលិក"
        : "Register to find a job or find a candidate",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      {children}
    </>
  );
}
