"use client";

import { useEffect, useState } from "react";

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
