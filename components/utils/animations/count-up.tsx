"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  to,
  duration = 900,
  className,
  format = false,
}: {
  to: number;
  duration?: number;
  className?: string;
  /** Format the value with locale thousands separators (e.g. 1,234) */
  format?: boolean;
}) {
  /* ------------------------------- All State -------------------------------- */
  const [value, setValue] = useState<number>(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef<number>(0);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const from = fromRef.current;

    if (to === from) return;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + eased * (to - from));
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <span className={className}>{format ? value.toLocaleString() : value}</span>
  );
}
