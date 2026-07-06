import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ស្វែងរកបេក្ខជន" : "Find Talent",
    description:
      lang === "km"
        ? "ស្វែងរកបេក្ខជនដែលសាកសមនឹងតម្រូវការរបស់អ្នក"
        : "Find candidates that match your needs",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
