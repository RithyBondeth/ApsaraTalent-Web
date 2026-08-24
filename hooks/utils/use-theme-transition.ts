"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next/client";
import { useThemeStore } from "@/stores/themes/theme-store";
import type { TTheme } from "@/utils/types/app/theme.type";
import type { TThemeTransitionDocument } from "@/components/utils/switcher/props";

/* ---------------------------------------------------------------------------
 * The whole-page theme reveal: the new theme expands in a circle from whatever
 * the person clicked, while the old page holds still beneath it.
 *
 * This lived inline in `Switcher`, which is only mounted on the landing, legal
 * and static pages. The signed-in navbar called the store's `toggleTheme()`
 * straight, so every page behind the app's own header snapped between themes
 * while the public pages animated — the same toggle, two behaviours, depending
 * on which side of the login you were standing.
 *
 * The CSS half (`html[data-theme-transition]::view-transition-*`, and the
 * `.theme-fallback-transition` cross-fade for browsers without the API) was
 * already global in globals.css. Only the trigger was missing.
 * ------------------------------------------------------------------------- */

const REVEAL_MS = 720;
const FALLBACK_MS = 560;
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function useThemeTransition() {
  /* ---------------------------------- Utils --------------------------------- */
  const { resolvedTheme, setTheme } = useTheme();
  const setStoredTheme = useThemeStore((state) => state.setTheme);

  const isTransitioning = useRef<boolean>(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  // A toggle unmounted mid-transition would otherwise leave the document
  // wearing the transition class and never take it off.
  useEffect(
    () => () => {
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      document.documentElement.classList.remove("theme-fallback-transition");
      delete document.documentElement.dataset.themeTransition;
    },
    [],
  );

  /* --------------------------------- Methods -------------------------------- */
  /**
   * Reveals an explicit choice. `system` is stored as the preference but the
   * class has to be set to whatever the OS currently resolves it to, since the
   * reveal paints the document itself rather than waiting for next-themes.
   */
  const setThemeWithReveal = useCallback(
    (
      target: TTheme,
      event?: { clientX?: number; currentTarget?: Element | null },
    ) => {
      if (isTransitioning.current) return;

      const root = document.documentElement;
      const nextResolved: "light" | "dark" =
        target === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : target;
      const currentResolved = root.classList.contains("dark")
        ? "dark"
        : "light";

      const applyTheme = () => {
        root.classList.toggle("dark", nextResolved === "dark");
        root.style.colorScheme = nextResolved;
        setTheme(target);
        setStoredTheme(target);
        setCookie("theme", target);
      };

      // Choosing "system" while already showing that theme changes the stored
      // preference but nothing on screen; a reveal of the identical page reads
      // as a flicker.
      if (nextResolved === currentResolved) {
        applyTheme();
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        applyTheme();
        return;
      }

      const transitionDocument = document as TThemeTransitionDocument;
      const startViewTransition =
        transitionDocument.startViewTransition?.bind(transitionDocument);

      if (!startViewTransition) {
        isTransitioning.current = true;
        root.classList.add("theme-fallback-transition");
        applyTheme();
        fallbackTimer.current = setTimeout(() => {
          root.classList.remove("theme-fallback-transition");
          isTransitioning.current = false;
        }, FALLBACK_MS);
        return;
      }

      isTransitioning.current = true;

      // Without a click point — a keyboard activation, say — the circle grows
      // from the control itself, and from the centre if even that is unknown.
      const rect = event?.currentTarget?.getBoundingClientRect();
      const originX =
        event?.clientX ||
        (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
      const originY =
        (event as { clientY?: number } | undefined)?.clientY ||
        (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);
      const endRadius = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY),
      );

      root.dataset.themeTransition = nextResolved;
      const transition = startViewTransition(applyTheme);

      transition.ready
        .then(() => {
          const reveal = root.animate(
            {
              clipPath: [
                `circle(0px at ${originX}px ${originY}px)`,
                `circle(${endRadius}px at ${originX}px ${originY}px)`,
              ],
            },
            {
              duration: REVEAL_MS,
              easing: EASING,
              fill: "both",
              pseudoElement: "::view-transition-new(root)",
            } as KeyframeAnimationOptions,
          );

          reveal.finished.finally(() => reveal.cancel());
        })
        .catch(() => undefined);

      transition.finished.finally(() => {
        delete root.dataset.themeTransition;
        isTransitioning.current = false;
      });
    },
    [setTheme, setStoredTheme],
  );

  const toggleTheme = useCallback(
    (event?: { clientX?: number; currentTarget?: Element | null }) =>
      setThemeWithReveal(
        document.documentElement.classList.contains("dark") ? "light" : "dark",
        event,
      ),
    [setThemeWithReveal],
  );

  return {
    isDark: resolvedTheme === "dark",
    toggleTheme,
    setThemeWithReveal,
  };
}
