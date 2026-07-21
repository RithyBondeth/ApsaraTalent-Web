"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Minimal theme toggle shared by the landing and auth pages.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const setStoreTheme = useThemeStore((state) => state.setTheme);
  const { resolvedTheme } = useTheme();
  const language = useLanguageStore((state) => state.language);

  /* -------------------------------- All States ------------------------------- */
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* -------------------------------- Handlers --------------------------------- */
  const isDark = mounted && resolvedTheme === "dark";
  const label =
    language === "km"
      ? isDark
        ? "ប្តូរទៅផ្ទៃពន្លឺ"
        : "ប្តូរទៅផ្ទៃងងឹត"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    setStoreTheme(nextTheme);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className={cn(
        "group relative inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
        "text-muted-foreground transition-[color,background-color,transform] duration-200 ease-out",
        "hover:bg-muted hover:text-foreground active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
        className,
      )}
    >
      <LucideSun
        aria-hidden
        className={cn(
          "absolute size-[1.1rem] transition-[opacity,transform] duration-200",
          isDark ? "scale-75 rotate-45 opacity-0" : "scale-100 opacity-100",
        )}
        strokeWidth={1.8}
      />
      <LucideMoon
        aria-hidden
        className={cn(
          "absolute size-[1.05rem] transition-[opacity,transform] duration-200",
          isDark ? "scale-100 opacity-100" : "scale-75 -rotate-45 opacity-0",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}
