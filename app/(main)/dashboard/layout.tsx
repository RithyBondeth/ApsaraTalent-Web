import type { Metadata } from "next";
import { cookies } from "next/headers";

/* -------------------------------- Meta Data -------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ផ្ទាំងគ្រប់គ្រង" : "Dashboard",
    description:
      lang === "km" ? "ផ្ទាំងគ្រប់គ្រងគណនីរបស់អ្នក" : "Your account dashboard",
  };
}

/* ------------------------------- Main Layout ------------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
