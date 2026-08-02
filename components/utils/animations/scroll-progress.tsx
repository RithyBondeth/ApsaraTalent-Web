"use client";

import { useGsapScrollProgress } from "@/hooks/utils/use-gsap-animation";

/**
 * Thin progress bar fixed to the top of the viewport — fills as the
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
      className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left scale-x-0 bg-foreground"
    />
  );
}
