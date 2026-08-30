import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ----------------------------- Meta Data ----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ស្វែងរកក្រុមហ៊ុន" : "Find Companies",
    description:
      lang === "km"
        ? "ស្វែងរកក្រុមហ៊ុនដែលសាកសមនឹងតម្រូវការរបស់អ្នក"
        : "Find companies that match your needs",
  };
}

/* ---------------------------- Main Layout ---------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
