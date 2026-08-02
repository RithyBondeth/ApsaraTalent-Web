"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

/**
 * Fades children in on mount — use this to wrap real content that replaces
 * a skeleton so the transition is a smooth crossfade rather than a snap.
 */
export function FadeIn(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, className, delay = 0, duration = 300 } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  /* -------------------------------- All States -------------------------------- */
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => setVisible(true));
    }, delay);
    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [delay, prefersReducedMotion]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={cn("transition-opacity", className)}
      style={{
        transitionDuration: prefersReducedMotion ? "0ms" : `${duration}ms`,
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Children Section */}
      {children}
    </div>
  );
}
