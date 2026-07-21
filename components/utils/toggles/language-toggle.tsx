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

/** Minimal segmented language control shared by landing and auth pages. */
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
        "relative inline-flex h-9 shrink-0 items-center rounded-lg bg-muted/65 p-0.5",
        className,
      )}
    >
      {/* Quiet Sliding Selection Section */}
      <span
        aria-hidden
        suppressHydrationWarning
        className="language-selection absolute bottom-0.5 left-0.5 top-0.5 w-[calc(50%-0.125rem)] rounded-md border border-border/70 bg-background shadow-[0_1px_2px_hsl(var(--foreground)/0.08)]"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

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
              "relative z-10 flex h-8 w-11 items-center justify-center rounded-md sm:w-12",
              "text-[11px] font-semibold leading-none tracking-[-0.01em]",
              "transition-colors duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ring-offset-background",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/80",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
