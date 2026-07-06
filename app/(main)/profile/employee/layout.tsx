import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ទំព័ររបស់ខ្ញុំ" : "My Profile",
    description:
      lang === "km" ? "កែប្រែប្រវត្តិរូបរបស់អ្នក" : "Edit your profile",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
