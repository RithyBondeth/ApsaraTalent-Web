import type { Metadata } from "next";
import { cookies } from "next/headers";

/* --------------------------------- Meta Data --------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ជ្រើសប្រភេទគណនី" : "Choose Account Type",
    description:
      lang === "km"
        ? "ជ្រើសប្រភេទគណនីរបស់អ្នកដើម្បីស្វែងរកការងារ ឬ ស្វែងរកបុគ្គលិក"
        : "Choose your account type to find a job or find a candidate",
  };
}

/* -------------------------------- Main Layout -------------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
