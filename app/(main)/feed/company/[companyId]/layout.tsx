import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ប្រវត្តិរូបក្រុមហ៊ុន" : "Company Profile",
    description:
      lang === "km"
        ? "ស្វែងរកឱកាសការងារនៅក្រុមហ៊ុននេះ"
        : "Find job opportunities at this company",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
