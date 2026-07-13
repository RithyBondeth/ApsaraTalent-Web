import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ចុះឈ្មោះជានិយោជិត" : "Employee Registration",
    description:
      lang === "km"
        ? "ចុះឈ្មោះជានិយោជិតដើម្បីស្វែងរកការងារ"
        : "Register as an employee to find a job",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
