"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";

/** Document with the (optionally supported) View Transitions API. */
type TViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => { ready: Promise<void> };
};

/**
 * Animated theme toggle shared by the landing and auth pages.
 *
 * A golden sun morphs into a golden crescent moon (rays retract, an eclipse
 * circle bites the disc), and the theme change itself sweeps across the page
 * as a circular reveal radiating from the button (View Transitions API, with
 * an instant fallback for unsupported browsers / reduced motion).
 */
export default function ThemeToggle({ className }: { className?: string }) {
  /* ---------------------------------- Utils ---------------------------------- */
  const setStoreTheme = useThemeStore((state) => state.setTheme);
  const { resolvedTheme } = useTheme();
  const language = useLanguageStore((state) => state.language);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // useId can contain ":" which breaks url(#…) references in some browsers.
  const maskId = `tt-mask-${useId().replace(/:/g, "")}`;

  /* -------------------------------- All States ------------------------------- */
  const [mounted, setMounted] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  // Enable morph transitions one frame after the real theme is applied, so the
  // icon never animates on initial page load.
  useEffect(() => {
    setMounted(true);
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
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
    const doc = document as TViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (typeof doc.startViewTransition !== "function" || prefersReducedMotion) {
      setStoreTheme(nextTheme);
      return;
    }

    // Expose the reveal origin (button center) and the radius needed to cover
    // the farthest viewport corner to the ::view-transition CSS.
    const bounds = buttonRef.current?.getBoundingClientRect();
    const x = bounds ? bounds.left + bounds.width / 2 : window.innerWidth;
    const y = bounds ? bounds.top + bounds.height / 2 : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement;
    root.style.setProperty("--theme-reveal-x", `${x}px`);
    root.style.setProperty("--theme-reveal-y", `${y}px`);
    root.style.setProperty("--theme-reveal-r", `${radius}px`);

    doc.startViewTransition(() => {
      flushSync(() => setStoreTheme(nextTheme));
      // ThemeSync applies the class in an effect (async); mirror it here so the
      // view-transition snapshot is captured with the new theme already active.
      root.classList.toggle("dark", nextTheme === "dark");
      root.style.colorScheme = nextTheme;
    });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      aria-label={label}
      title={label}
      className={cn(
        "group relative inline-flex size-10 shrink-0 items-center justify-center rounded-full",
        "border border-border/70 bg-background/60 backdrop-blur-md",
        "text-amber-600 dark:text-amber-400",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        "hover:border-amber-400/60 hover:shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)]",
        "dark:hover:border-amber-400/40 dark:hover:shadow-[0_0_20px_-4px_rgba(251,191,36,0.45)]",
        "active:scale-90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
    >
      {/* Soft golden halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.28),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Sun ⇄ Moon morph */}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "tt-icon relative size-[1.35rem]",
          ready && "tt-ready",
          isDark && "tt-dark",
        )}
        fill="none"
        aria-hidden
      >
        <mask id={maskId}>
          <rect width="24" height="24" fill="#fff" />
          <circle className="tt-eclipse" cx="26" cy="-2" r="8.5" fill="#000" />
        </mask>
        <circle
          className="tt-core"
          cx="12"
          cy="12"
          r="4.4"
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <g
          className="tt-rays"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <line x1="12" y1="1.8" x2="12" y2="4.2" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(45 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(90 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(135 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(180 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(225 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(270 12 12)" />
          <line x1="12" y1="1.8" x2="12" y2="4.2" transform="rotate(315 12 12)" />
        </g>
      </svg>
    </button>
  );
}
