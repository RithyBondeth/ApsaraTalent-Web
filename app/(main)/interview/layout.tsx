import type { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "សម្ភាសន៍" : "Interviews",
    description:
      lang === "km"
        ? "ការសម្ភាសន៍ដែលបានកំណត់ពេលដើម្បីវាយតម្លៃបេក្ខជន"
        : "Scheduled meetings to evaluate candidates",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
