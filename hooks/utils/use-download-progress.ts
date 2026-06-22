import { useRef, useState } from "react";

/* ----------------------------------- Usage ------------------------------------ */
/**
 * Provides a fake-progress bar value that crawls up to a cap, then snaps to
 * 100 when the actual operation completes — useful for file download UIs.
 *
 * Usage:
 *   const { progress, start, stop } = useDownloadProgress();
 *
 *   // Begin the crawl (stops itself at `cap`%, default 92)
 *   start();          // or start(80) for a different cap
 *
 *   // After the real download finishes, snap to 100
 *   stop();           // or stop(95) for a custom final value
 *
 *   <ProgressBar value={progress} />
 */

/* ------------------------------------ Hook ------------------------------------ */
export function useDownloadProgress() {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (cap = 92) => {
    setProgress(0);
    let current = 0;
    timerRef.current = setInterval(() => {
      const increment = Math.max(0.5, (cap - current) * 0.04);
      current = Math.min(cap, current + increment);
      setProgress(current);
      if (current >= cap) clearInterval(timerRef.current!);
    }, 300);
  };

  const stop = (finalValue = 100) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(finalValue);
  };

  return { progress, start, stop };
}
