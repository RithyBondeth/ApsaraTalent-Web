import type { Metadata } from "next";
import { cookies } from "next/headers";

/* -------------------------------- Meta Data -------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "រក្សាទុក" : "Favorite",
    description:
      lang === "km"
        ? "បញ្ជីដែលអ្នកបានរក្សាទុកសម្រាប់ការពិនិត្យឡើងវិញនៅពេលក្រោយ"
        : "List of items you have saved for later review",
  };
}

/* ------------------------------- Main Layout ------------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
