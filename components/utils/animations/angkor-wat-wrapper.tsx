"use client";

import dynamic from "next/dynamic";
import { LucideTriangleAlert } from "lucide-react";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";

/* ----------------------------------- Helper ---------------------------------- */
const AngkorWatScene = dynamic(
  () => import("@/components/utils/animations/angkor-wat-scene"),
  {
    ssr: false,
  },
);

type TAngkorWatErrorBoundaryState = {
  hasError: boolean;
};

class AngkorWatErrorBoundary extends Component<
  { children: ReactNode },
  TAngkorWatErrorBoundaryState
> {
  state: TAngkorWatErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): TAngkorWatErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Angkor Wat scene failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-amber-50/40 to-background dark:from-amber-950/10 dark:to-background">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
              <LucideTriangleAlert className="size-7" />
            </div>
            <p className="text-lg font-semibold text-foreground">
              3D preview unavailable
            </p>
            <p className="text-sm text-muted-foreground">
              The interactive Angkor Wat scene could not load on this device or
              browser, but the rest of the page is still available.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function AngkorWatWrapper() {
  /* -------------------------------- All States ------------------------------ */
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hostRef]);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div ref={hostRef} className="absolute inset-0">
      <AngkorWatErrorBoundary>
        {shouldRender ? <AngkorWatScene /> : null}
      </AngkorWatErrorBoundary>
    </div>
  );
}
