"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

  /* -------------------------------- All States -------------------------------- */
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(() => setVisible(true));
    }, delay);
    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [delay]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={cn(
        "transition-[opacity,transform] ease-out motion-reduce:transform-none",
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      {/* Children Section */}
      {children}
    </div>
  );
}
