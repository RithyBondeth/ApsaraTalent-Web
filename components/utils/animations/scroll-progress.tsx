"use client";

import { useGsapScrollProgress } from "@/hooks/utils/use-gsap-animation";

/**
 * Thin gold progress bar fixed to the top of the viewport — fills as the
 * page scrolls (GSAP scrub, no-op for reduced-motion users).
 */
export function ScrollProgress() {
  /* ---------------------------------- Utils --------------------------------- */
  const barRef = useGsapScrollProgress<HTMLDivElement>();

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      ref={barRef}
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left scale-x-0 bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-400"
    />
  );
}
