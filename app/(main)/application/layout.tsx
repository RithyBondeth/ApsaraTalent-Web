import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ----------------------------- Meta Data ----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ពាក្យសុំការងារ" : "Applications",
    description:
      lang === "km"
        ? "តាមដានពាក្យសុំការងារ និងបេក្ខជនតាមដំណាក់កាលនីមួយៗ"
        : "Track applications and candidates through every stage",
  };
}

/* ---------------------------- Main Layout ---------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
