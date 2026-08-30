import type { Metadata } from "next";
import { cookies } from "next/headers";

/* ----------------------------- Meta Data ----------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ភ្លេចពាក្យសម្ងាត់" : "Forgot Password",
    description:
      lang === "km"
        ? "ភ្លេចពាក្យសម្ងាត់របស់អ្នក? វាយបញ្ចូលអ៊ីមែលរបស់អ្នកដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ"
        : "Forgot your password? Enter your email to reset your password",
  };
}

/* ---------------------------- Main Layout ---------------------------- */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
