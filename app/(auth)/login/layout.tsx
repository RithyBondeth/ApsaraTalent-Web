import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ------------------------------ Meta Data ------------------------------ */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ចូលប្រើប្រាស់" : "Login",
    description:
      lang === "km"
        ? "ចូលប្រើប្រាស់គណនីរបស់អ្នកដើម្បីស្វែងរកការងារ ឬ ស្វែងរកបុគ្គលិក"
        : "Login to your account to find a job or find a candidate",
  };
}

/* ----------------------------- Main Layout ----------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
