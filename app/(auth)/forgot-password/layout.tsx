import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return { title: lang === "km" ? "ភ្លេចពាក្យសម្ងាត់" : "Forgot Password" };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
