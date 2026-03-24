import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return { title: lang === "km" ? "រក្សាទុក" : "Favorite" };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
