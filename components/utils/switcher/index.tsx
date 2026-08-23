"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { setCookie } from "cookies-next";
import { LucideLanguages, LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { ISwitcherProps, TThemeTransitionDocument } from "./props";

export default function Switcher(props: ISwitcherProps) {
  /* ------------------------------- Props ------------------------------- */
  const { className, inline = false } = props;

  /* ------------------------------- Utils ------------------------------- */
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme: setStoredTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();

  /* ---------------------------- All States ---------------------------- */
  const [mounted, setMounted] = useState(false);
  const themeTransitionTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isThemeTransitioning = useRef(false);

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

  useEffect(
    () => () => {
      if (themeTransitionTimer.current) {
        clearTimeout(themeTransitionTimer.current);
      }
      document.documentElement.classList.remove("theme-fallback-transition");
      delete document.documentElement.dataset.themeTransition;
    },
    [],
  );

  /* -------------------------- Derived States -------------------------- */
  const isDark = mounted && resolvedTheme === "dark";

  /* ----------------------------- Methods ------------------------------ */
  // ── Handle Language Change ───────────────────────────────────────────
  const handleLanguageChange = (nextLanguage: "en" | "km") => {
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
  };

  // ── Handle Theme Toggle ──────────────────────────────────────────────
  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isThemeTransitioning.current) return;

    const nextTheme = isDark ? "light" : "dark";
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const applyTheme = () => {
      root.classList.toggle("dark", nextTheme === "dark");
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
      setStoredTheme(nextTheme);
      setCookie("theme", nextTheme);
    };

    if (reduceMotion) {
      applyTheme();
      return;
    }

    const transitionDocument = document as TThemeTransitionDocument;
    const startViewTransition =
      transitionDocument.startViewTransition?.bind(transitionDocument);

    if (!startViewTransition) {
      isThemeTransitioning.current = true;
      root.classList.add("theme-fallback-transition");
      applyTheme();
      themeTransitionTimer.current = setTimeout(() => {
        root.classList.remove("theme-fallback-transition");
        isThemeTransitioning.current = false;
      }, 560);
      return;
    }

    isThemeTransitioning.current = true;
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const originX = event.clientX || buttonRect.left + buttonRect.width / 2;
    const originY = event.clientY || buttonRect.top + buttonRect.height / 2;
    const endRadius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    root.dataset.themeTransition = nextTheme;
    const transition = startViewTransition(applyTheme);

    transition.ready
      .then(() => {
        const revealAnimation = root.animate(
          {
            clipPath: [
              `circle(0px at ${originX}px ${originY}px)`,
              `circle(${endRadius}px at ${originX}px ${originY}px)`,
            ],
          },
          {
            duration: 720,
            easing: "cubic-bezier(0.76, 0, 0.24, 1)",
            fill: "both",
            pseudoElement: "::view-transition-new(root)",
          } as KeyframeAnimationOptions,
        );

        revealAnimation.finished.finally(() => revealAnimation.cancel());
      })
      .catch(() => undefined);

    transition.finished.finally(() => {
      delete root.dataset.themeTransition;
      isThemeTransitioning.current = false;
    });
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
