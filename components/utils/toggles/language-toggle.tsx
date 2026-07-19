"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { TLanguage } from "@/utils/types/app/language.type";
import { setCookie } from "cookies-next";
import { useEffect } from "react";

const OPTIONS: { value: TLanguage; label: string; hint: string }[] = [
  { value: "en", label: "EN", hint: "English" },
  { value: "km", label: "ខ្មែរ", hint: "ភាសាខ្មែរ" },
];

/**
 * Segmented language pill shared by the landing and auth pages.
 *
 * Two fixed segments (EN | ខ្មែរ) with a gold-gradient thumb that slides with
 * a springy overshoot and squashes as it lands — no dropdown needed for a
 * two-language switch.
 */
export default function LanguageToggle({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const { language, setLanguage } = useLanguageStore();

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setCookie("language", language);
  }, [language]);

  /* -------------------------------- Render UI -------------------------------- */
  const activeIndex = language === "km" ? 1 : 0;

  return (
    <div
      role="group"
      aria-label="Language / ភាសា"
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center rounded-full p-1",
        "border border-border/70 bg-background/60 backdrop-blur-md",
        "transition-[border-color,box-shadow] duration-300 ease-out",
        "hover:border-amber-400/50 hover:shadow-[0_0_20px_-6px_rgba(245,158,11,0.45)]",
        className,
      )}
    >
      {/* Sliding gold thumb */}
      <span
        aria-hidden
        suppressHydrationWarning
        className="lang-thumb-track absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)]"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      >
        <span
          key={language}
          className="lang-thumb-pop block size-full rounded-full bg-gradient-to-r from-amber-600 to-amber-500 shadow-md shadow-amber-500/30 dark:from-amber-500 dark:to-amber-400 dark:shadow-amber-400/25"
        />
      </span>

      {OPTIONS.map((option) => {
        const isActive = language === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLanguage(option.value)}
            aria-pressed={isActive}
            title={option.hint}
            className={cn(
              "relative z-10 flex h-8 w-11 items-center justify-center rounded-full sm:w-12",
              "text-xs font-semibold leading-none",
              "transition-colors duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              isActive
                ? "text-white dark:text-black"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
