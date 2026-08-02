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
        "bg-foreground text-background shadow-[0_4px_20px_hsl(var(--foreground)/0.25)]",
        "transition-all duration-300 ease-out",
        "hover:scale-110 hover:shadow-[0_6px_28px_hsl(var(--foreground)/0.35)] active:scale-95",
        "motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
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
