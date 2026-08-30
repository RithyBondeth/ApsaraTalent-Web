"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

/* ---------------------------------------------------------------------------
 * The page's scroll progress line, fixed to the very top of the viewport.
 *
 * There used to be two of these. The main app rendered a 3px bar filled with a
 * hardcoded `primary → #7c3aed → #ec4899` gradient at `z-[9999]`, driven by
 * React state on every animation frame; the landing and legal pages rendered a
 * 2px ink bar at `z-[60]`, driven by a GSAP scrub. They disagreed on height,
 * colour, stacking order, mechanism, and — the part that mattered — on what to
 * do for someone who asks for reduced motion. The GSAP one simply never left
 * `scale-x-0`, so those users got no progress indicator at all. Progress is
 * information, not decoration: reduced motion should drop the easing, not the
 * information.
 *
 * `z-[60]` puts the line above both headers (each `z-50`) and below anything
 * modal (`z-[100]`+). At `z-[9999]` it painted a stripe across the top of an
 * open dialog's scrim.
 *
 * The transform is written straight to the node rather than through state:
 * scrolling a long page otherwise re-rendered this component sixty times a
 * second. Only `transition`, which changes when the media query flips, is
 * rendered by React.
 * ------------------------------------------------------------------------- */

export function ScrollProgressBar() {
  /* --------------------------------- Utils ---------------------------------- */
  const pathname = usePathname();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  /* -------------------------------- All States ------------------------------ */
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  // Handle Scroll Effect
  useEffect(() => {
    const paint = () => {
      rafRef.current = null;
      const bar = barRef.current;
      if (!bar) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(paint);
    };

    // Paint once on mount and on every navigation: a route change can land
    // part-way down a restored scroll position, and the bar has to agree.
    paint();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [pathname]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px]"
    >
      {/* Progress Bar Section */}
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-primary will-change-transform"
        style={{
          transition: prefersReducedMotion ? "none" : "transform 80ms linear",
        }}
      />
    </div>
  );
}
