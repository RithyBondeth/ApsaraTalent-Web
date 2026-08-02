"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { setCookie } from "cookies-next";
import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type {
  ISwitcherProps,
  TAnimationKind,
  TThemeTransitionDocument,
} from "./props";

const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;

export default function Switcher(props: ISwitcherProps) {
  /* ------------------------------- Props ------------------------------- */
  const { className, inline = false } = props;

  /* ------------------------------- Utils ------------------------------- */
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme: setStoredTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();

  /* ---------------------------- All States ---------------------------- */
  const [mounted, setMounted] = useState(false);
  const [animationKind, setAnimationKind] = useState<TAnimationKind>(null);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (animationTimer.current) clearTimeout(animationTimer.current);
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
  // ── Play Control Animation ───────────────────────────────────────────
  const playAnimation = (kind: Exclude<TAnimationKind, null>) => {
    if (animationTimer.current) clearTimeout(animationTimer.current);
    setAnimationKind(kind);
    animationTimer.current = setTimeout(() => setAnimationKind(null), 720);
  };

  // ── Handle Language Change ───────────────────────────────────────────
  const handleLanguageChange = (nextLanguage: "en" | "km") => {
    if (nextLanguage === language) return;
    playAnimation("language");
    setLanguage(nextLanguage);
  };

  // ── Handle Theme Toggle ──────────────────────────────────────────────
  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isThemeTransitioning.current) return;

    playAnimation("theme");
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
  return (
    <div
      className={cn(
        inline ? "relative" : "fixed right-4 top-4 z-50",
        "switcher-enter",
        className,
      )}
    >
      {/* Language and Theme Switcher Section */}
      {/* Switcher Control Section */}
      <div
        className="switcher-pill"
        data-language={language}
        data-theme={isDark ? "dark" : "light"}
        data-animating={animationKind ?? "idle"}
      >
        {/* Switcher Sheen Section */}
        <span className="switcher-sheen" aria-hidden />

        {/* Language Controls Section */}
        <div
          className="switcher-lang-segment"
          role="group"
          aria-label="Language"
        >
          <span className="switcher-lang-indicator" aria-hidden />
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            className="switcher-lang-option"
            aria-label="Use English"
            aria-pressed={language === "en"}
          >
            <span className="switcher-lang-text">EN</span>
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange("km")}
            className="switcher-lang-option"
            aria-label="ប្រើភាសាខ្មែរ"
            aria-pressed={language === "km"}
          >
            <span className="switcher-lang-text switcher-lang-text-km">
              ខ្មែរ
            </span>
          </button>
        </div>

        {/* Control Divider Section */}
        <span className="switcher-divider" aria-hidden />

        {/* Theme Control Section */}
        <button
          type="button"
          onClick={handleThemeToggle}
          className="switcher-theme-btn"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Light theme" : "Dark theme"}
        >
          {/* Theme Track Section */}
          <span className="switcher-theme-track" aria-hidden>
            <span className="switcher-theme-knob">
              <LucideSun className="switcher-theme-icon switcher-sun-icon" />
              <LucideMoon className="switcher-theme-icon switcher-moon-icon" />
            </span>
          </span>
          {/* Theme Spark Animation Section */}
          <span className="switcher-sparks" aria-hidden>
            {SPARK_ANGLES.map((angle, index) => (
              <span
                key={angle}
                style={
                  {
                    "--angle": `${angle}deg`,
                    "--spark-delay": `${index * 18}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </span>
        </button>
      </div>
    </div>
  );
}
