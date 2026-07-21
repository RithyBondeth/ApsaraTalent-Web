import type { Metadata } from "next";
import { cookies } from "next/headers";
import LanguageToggle from "@/components/utils/toggles/language-toggle";
import ThemeToggle from "@/components/utils/toggles/theme-toggle";

export async function generateMetadata(): Promise<Metadata> {
  const lang = (await cookies()).get("language")?.value ?? "en";
  return {
    title: lang === "km" ? "ចុះឈ្មោះ" : "Registration",
    description:
      lang === "km"
        ? "ចុះឈ្មោះដើម្បីស្វែងរកការងារ ឬ ស្វែងរកបុគ្គលិក"
        : "Register to find a job or find a candidate",
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-scope relative isolate min-h-screen overflow-x-hidden bg-background">
      <div className="auth-toolbar ambient-control-cluster fixed right-4 top-4 z-50 flex items-center gap-1 rounded-xl border border-border/70 bg-card/80 p-1 shadow-[0_1px_2px_hsl(var(--foreground)/0.04)] backdrop-blur-md">
        <LanguageToggle />
        <span className="h-5 w-px bg-border/70" aria-hidden />
        <ThemeToggle />
      </div>
      {children}
    </div>
  );
}
