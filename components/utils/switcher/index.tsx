"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { setCookie } from "cookies-next";
import { LucideLanguages, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { ISwitcherProps } from "./props";
import { useThemeTransition } from "@/hooks/utils/use-theme-transition";

export default function Switcher(props: ISwitcherProps) {
  /* ------------------------------- Props ------------------------------- */
  const { className, inline = false } = props;

  /* ------------------------------- Utils ------------------------------- */
  const { language, setLanguage } = useLanguageStore();
  const { theme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const { toggleTheme } = useThemeTransition();

  /* ---------------------------- All States ---------------------------- */
  const [mounted, setMounted] = useState(false);

  /* ----------------------------- Effects ------------------------------ */
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  useEffect(() => {
    if (mounted) {
      setTheme(theme);
      setCookie("theme", theme);
    }
  }, [theme, setTheme, mounted]);

  /* -------------------------- Derived States -------------------------- */
  const isDark = mounted && resolvedTheme === "dark";

  /* ----------------------------- Methods ------------------------------ */
  // ── Handle Language Change ───────────────────────────────────────────
  const handleLanguageChange = (nextLanguage: "en" | "km") => {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
  };

  // ── Handle Theme Toggle ──────────────────────────────────────────────
  // The reveal now lives in useThemeTransition, shared with the signed-in
  // navbar — it was defined here, which is why only the public pages had it.
  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(event);
  };

  /* ----------------------------- Render UI ----------------------------- */
  // Two matched icon buttons rather than a bespoke pill. Both borrow the app's
  // icon-control language — square, hairline edge, accent hover — so the pair
  // reads the same as every other icon button in the product. Language uses
  // LucideLanguages, the icon the settings page and the navbar menu already use.
  const control =
    "flex size-9 items-center justify-center rounded-none border border-border bg-card text-muted-foreground shadow-hard-xs transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  return (
    <div
      className={cn(
        inline ? "relative" : "fixed right-4 top-4 z-50",
        "flex items-center gap-1.5",
        className,
      )}
    >
      {/* Language Control Section */}
      <button
        type="button"
        onClick={() => handleLanguageChange(language === "en" ? "km" : "en")}
        className={control}
        aria-label={
          language === "en" ? "ប្តូរទៅភាសាខ្មែរ" : "Switch to English"
        }
        title={language === "en" ? "ភាសាខ្មែរ" : "English"}
      >
        <LucideLanguages className="size-4" strokeWidth={1.8} />
      </button>

      {/* Theme Control Section */}
      <button
        type="button"
        onClick={handleThemeToggle}
        className={control}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Light theme" : "Dark theme"}
      >
        {isDark ? (
          <LucideMoon className="size-4" strokeWidth={1.8} />
        ) : (
          <LucideSun className="size-4" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}
