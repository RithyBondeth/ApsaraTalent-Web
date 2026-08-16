"use client";

import { useEffect, useState } from "react";
import { LucideArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

export function ScrollToTop() {
  /* ---------------------------------- Utils --------------------------------- */
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  /* ------------------------------- All States ------------------------------- */
  const [visible, setVisible] = useState<boolean>(false);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Click ─────────────────────────
  const handleClick = () =>
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-24 right-4 z-40 lg:bottom-8 lg:right-6",
        "flex size-10 items-center justify-center rounded-full",
        /* pixel-overlay-shadow is the one shadow the design ships, and this
        genuinely floats over scrolling content. */
        "pixel-overlay-shadow bg-foreground text-background",
        "transition-all duration-300 ease-out",
        /* Was scale-110 plus a 28px blurred shadow that deepened on hover.
           The arrow inside travels one --pixel-unit instead — the one case
           where the shuttle runs vertically, because the control's whole
           meaning is "up". */
        "[&>svg]:transition-transform [&>svg]:duration-300 hover:[&>svg]:-translate-y-1",
        "motion-reduce:transition-none motion-reduce:hover:[&>svg]:translate-y-0",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      {/* Icon Section */}
      <LucideArrowUp className="size-4 shrink-0" strokeWidth={2.2} />
    </button>
  );
}
