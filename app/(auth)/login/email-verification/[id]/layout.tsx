import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ផ្ទៀងផ្ទាត់អ៊ីមែល" : "Verify Email",
    description:
      lang === "km"
        ? "ផ្ទៀងផ្ទាត់អ៊ីមែលរបស់អ្នកដើម្បីបន្តការចុះឈ្មោះ"
        : "Verify your email to continue registration",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
