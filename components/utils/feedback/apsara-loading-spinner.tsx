import React, { useEffect, useState } from "react";
import LogoComponent from "@/components/utils/brand/logo";
import { BRAND_SYMBOL_ASPECT_RATIO } from "@/utils/constants/brand-dimensions.constant";
import { useMediaQuery } from "@/hooks/utils/use-media-query";

/* ----------------------------------- Helper ---------------------------------- */
interface IApsaraLoadingProps {
  size?: number;
  duration?: number;
  loop?: boolean;
  className?: string;
  onComplete?: () => void;
}

export default function ApsaraLoadingSpinner(props: IApsaraLoadingProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const {
    size = 150,
    duration = 2000,
    loop = true,
    className = "",
    onComplete,
  } = props;

  /* ---------------------------------- Utils ---------------------------------- */
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  /* -------------------------------- All States ------------------------------ */
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    let animationId: number;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;
    let restartTimer: ReturnType<typeof setTimeout> | null = null;

    if (prefersReducedMotion) {
      setIsAnimating(loop);
      setProgress(loop ? 0.5 : 1);
      if (!loop && onComplete) {
        completionTimer = setTimeout(onComplete, duration);
      }
      return () => {
        if (completionTimer) clearTimeout(completionTimer);
      };
    }

    setIsAnimating(true);

    const startAnimation = () => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(elapsed / duration, 1);

        setProgress(newProgress);

        if (newProgress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          onComplete?.();

          if (loop) {
            // Brief pause before restarting Section
            restartTimer = setTimeout(() => {
              setProgress(0);
              startAnimation();
            }, 300);
          } else {
            setIsAnimating(false);
          }
        }
      };

      animationId = requestAnimationFrame(animate);
    };

    startAnimation();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (completionTimer) clearTimeout(completionTimer);
      if (restartTimer) clearTimeout(restartTimer);
    };
  }, [duration, loop, onComplete, prefersReducedMotion]);

  const logoHeight = size / BRAND_SYMBOL_ASPECT_RATIO;

  return (
    <div
      className={`flex w-fit flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <div
        aria-hidden="true"
        className="flex items-center justify-center"
        style={{
          width: size,
          height: size,
          opacity:
            prefersReducedMotion || !isAnimating ? 1 : 0.35 + progress * 0.65,
        }}
      >
        <LogoComponent withoutTitle height={logoHeight} />
      </div>
      <span aria-hidden="true" className="text-xs text-muted-foreground">
        {prefersReducedMotion
          ? "Loading..."
          : `Loading... ${Math.round(progress * 100)}%`}
      </span>
    </div>
  );
}
