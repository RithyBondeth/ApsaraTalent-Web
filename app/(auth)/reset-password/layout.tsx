import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ------------------------------- Meta Data ------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "កំណត់ពាក្យសម្ងាត់ឡើងវិញ" : "Reset Password",
    description:
      lang === "km"
        ? "កំណត់ពាក្យសម្ងាត់ថ្មីរបស់អ្នកដើម្បីបន្តការប្រើប្រាស់"
        : "Reset your password to continue using the platform",
  };
}

/* ------------------------------ Main Layout ------------------------------ */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
