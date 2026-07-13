import type { Metadata } from "next";
import { cookies } from "next/headers";

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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
