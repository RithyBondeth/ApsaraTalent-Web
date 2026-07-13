import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ចុះឈ្មោះជាក្រុមហ៊ុន" : "Company Registration",
    description:
      lang === "km"
        ? "ចុះឈ្មោះជាក្រុមហ៊ុនដើម្បីស្វែងរកបុគ្គលិក"
        : "Register as a company to find employees",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
