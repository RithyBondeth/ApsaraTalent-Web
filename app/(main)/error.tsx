"use client";

import { Button } from "@/components/ui/button";
import { LucideRefreshCw, LucideTriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* -------------------------------- Effects ------------------------------- */
  useEffect(() => {
    console.error(error);
  }, [error]);

  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-4">
      {/* Animated Icon Section */}
      <div className="relative flex items-center justify-center">
        {/* Outer slow-pulse ring */}
        <div className="absolute size-36 rounded-full bg-destructive/8 animate-pulse" />
        {/* Middle ring */}
        <div className="absolute size-28 rounded-full bg-destructive/10" />
        {/* Icon container with gradient + glow */}
        <div className="relative flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-destructive/20 via-destructive/10 to-destructive/5 border border-destructive/25 shadow-[0_4px_24px_hsl(var(--destructive)/0.2)]">
          <LucideTriangleAlert className="size-9 text-destructive" />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
          An unexpected error occurred. You can try again or go back to the
          previous page.
        </p>
        {error.digest && (
          <p className="mx-auto mt-1 inline-block rounded-md bg-muted/60 px-3 py-1.5 font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Action Section */}
      <Button onClick={reset} className="gap-2 rounded-xl px-6">
        <LucideRefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
