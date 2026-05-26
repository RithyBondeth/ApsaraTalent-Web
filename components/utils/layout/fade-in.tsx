"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the fade starts, in ms. Default 0. */
  delay?: number;
  /** Duration of the fade, in ms. Default 300. */
  duration?: number;
}

/**
 * Fades children in on mount — use this to wrap real content that replaces
 * a skeleton so the transition is a smooth crossfade rather than a snap.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 300,
}: FadeInProps) {
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => setVisible(true));
    }, delay);
    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [delay]);

  return (
    <div
      className={cn("transition-opacity", className)}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: visible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
