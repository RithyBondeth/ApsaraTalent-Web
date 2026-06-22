"use client";

import { useEffect, useState } from "react";

/* ------------------------------------ Usage ----------------------------------- */
/**
 * Reactively tracks a CSS media query string and returns whether it matches.
 *
 * Usage:
 *   const isLargeScreen = useMediaQuery("(min-width: 1024px)");
 *   const prefersDark   = useMediaQuery("(prefers-color-scheme: dark)");
 *
 *   // Returns true when the query matches, false otherwise.
 *   // Re-renders automatically when the match state changes.
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useMediaQuery(query: string): boolean {
  /* -------------------------------- All States -------------------------------- */
  const [matches, setMatches] = useState<boolean>(false);

  /* ---------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
