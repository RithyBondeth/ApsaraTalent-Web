import type { Metadata } from "next";
import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/utils/language-switcher";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return { title: lang === "km" ? "ចុះឈ្មោះ" : "Registration" };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LanguageSwitcher />
      {children}
    </>
  );
}
