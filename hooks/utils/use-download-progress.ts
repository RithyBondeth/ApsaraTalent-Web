import { useRef, useState } from "react";

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
