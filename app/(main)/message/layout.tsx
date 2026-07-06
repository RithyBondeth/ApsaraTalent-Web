import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ប្រអប់សារ" : "Messages",
    description:
      lang === "km"
        ? "ប្រអប់សារសម្រាប់ប្រាស្រ័យទាក់ទងគ្នា"
        : "Message box for communicating with each other",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
