"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { setCookie } from "cookies-next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LucideSun, LucideMoon } from "lucide-react";
import type { SwitcherProps } from "./props";

export default function Switcher({ className, inline = false }: SwitcherProps) {
  const { language, setLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [starBurst, setStarBurst] = useState(false);

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

  const isDark = mounted && resolvedTheme === "dark";

  const handleLanguageChange = (lang: "en" | "km") => {
    if (lang === language) return;
    setLanguage(lang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setStarBurst(true);
    setTimeout(() => setStarBurst(false), 700);
  };

  return (
    <div
      className={cn(
        inline ? "relative" : "fixed top-4 right-4 z-50",
        "switcher-enter",
        className,
      )}
    >
      <div className="switcher-pill">
        {/* Ambient glow */}
        <div className="switcher-glow" />

        {/* Language Segment */}
        <div className="switcher-lang-segment">
          {/* Sliding indicator */}
          <div
            className="switcher-lang-indicator"
            style={{
              transform: language === "en" ? "translateX(0)" : "translateX(100%)",
            }}
          />

          <button
            onClick={() => handleLanguageChange("en")}
            className={cn(
              "switcher-lang-option",
              language === "en" && "switcher-lang-active",
            )}
          >
            <span
              className="switcher-lang-text"
              style={{
                transform: language === "en" ? "scale(1)" : "scale(0.85)",
                opacity: language === "en" ? 1 : 0.4,
              }}
            >
              EN
            </span>
          </button>

          <button
            onClick={() => handleLanguageChange("km")}
            className={cn(
              "switcher-lang-option",
              language === "km" && "switcher-lang-active",
            )}
          >
            <span
              className="switcher-lang-text"
              style={{
                transform: language === "km" ? "scale(1)" : "scale(0.85)",
                opacity: language === "km" ? 1 : 0.4,
              }}
            >
              ខ្មែរ
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="switcher-divider" />

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className={cn("switcher-theme-btn", starBurst && "switcher-theme-flash")}
          aria-label="Toggle theme"
        >
          <div className="switcher-icon-wrap">
            <LucideSun
              size={18}
              strokeWidth={2}
              className={cn(
                "switcher-lucide-icon switcher-sun-icon",
                !isDark && "switcher-lucide-visible",
              )}
            />
            <LucideMoon
              size={18}
              strokeWidth={2}
              className={cn(
                "switcher-lucide-icon switcher-moon-icon",
                isDark && "switcher-lucide-visible",
              )}
            />
          </div>

          {/* Star particles */}
          {starBurst && (
            <div className="switcher-stars-container">
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <span
                  key={angle}
                  className="switcher-star-particle"
                  style={{ "--angle": `${angle}deg` } as React.CSSProperties}
                />
              ))}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
