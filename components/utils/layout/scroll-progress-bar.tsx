"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function ScrollProgressBar() {
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();

  /* -------------------------------- All States ------------------------------ */
  const [progress, setProgress] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
    >
      {/* Progress Bar Section */}
      <div
        className="h-full origin-left will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--primary)) 0%, #7c3aed 55%, #ec4899 100%)",
          transform: `scaleX(${progress / 100})`,
          transition: progress === 0 ? "none" : "transform 80ms linear",
        }}
      />
    </div>
  );
}
