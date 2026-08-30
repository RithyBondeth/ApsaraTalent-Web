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
        // Square, like every other control. This was the one free-floating
        // round button in the app that was not a phone-call control — a
        // Material FAB borrowed into a hard-edged system, down to the soft
        // blur glow and the scale-on-hover.
        "flex size-10 items-center justify-center rounded-none",
        // `hard-lg` is the floating step, but 8px of offset under a 40px
        // button is a fifth of its own size — subtle on a card, chunky here.
        // It rests one step down and grows into the float on hover.
        //
        // The surface is the app's floating-control language, the same one the
        // card's like/quick-view buttons use over a cover photo: a translucent
        // page fill behind a blur, held by a hairline and the offset shadow.
        // It was a solid ink block, which made a utility control the loudest
        // thing in the corner of every page.
        "border border-border bg-background/90 text-foreground shadow-hard backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        // The card hover language: lift and deepen, then press back on click.
        "hover:bg-accent hover:text-accent-foreground",
        "hover:-translate-y-0.5 hover:shadow-hard-lg",
        "active:translate-y-0 active:shadow-hard-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "motion-reduce:transform-none motion-reduce:transition-none motion-reduce:hover:translate-y-0",
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
