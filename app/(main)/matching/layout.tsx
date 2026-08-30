import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ----------------------------- Meta Data ----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ការផ្គូផ្គង" : "Matching",
    description:
      lang === "km"
        ? "បេក្ខជនដែលសាកសមនឹងតម្រូវការរបស់អ្នក"
        : "Candidates that match your needs",
  };
}

/* ---------------------------- Main Layout ---------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
