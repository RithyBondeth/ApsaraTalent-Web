import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return { title: lang === "km" ? "ចូលតាមទូរស័ព្ទ" : "Phone Sign In" };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
