"use client";

import { useEffect, useState } from "react";
import { LucideArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" });

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
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <LucideArrowUp className="size-4 shrink-0" strokeWidth={2.2} />
    </button>
  );
}
