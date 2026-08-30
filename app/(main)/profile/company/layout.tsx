import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ----------------------------- Meta Data ----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ប្រវត្តិរូបក្រុមហ៊ុន" : "Company Profile",
    description:
      lang === "km"
        ? "កែប្រែប្រវត្តិរូបក្រុមហ៊ុនរបស់អ្នក"
        : "Edit your company profile",
  };
}

/* ---------------------------- Main Layout ---------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
