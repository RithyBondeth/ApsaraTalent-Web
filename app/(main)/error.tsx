"use client";

import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
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
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6 border border-border border-t-[5px] border-t-destructive bg-card shadow-[6px_6px_0_hsl(var(--foreground)/0.055)]">
      {/* Animated Icon Section */}
      <div className="relative flex items-center justify-center">
        {/* Outer slow-pulse ring */}
        <div className="absolute size-36 rotate-12 rounded-none border border-destructive/10 bg-destructive/5 animate-pulse" />
        {/* Middle ring */}
        <div className="absolute size-28 -rotate-6 rounded-none border border-destructive/15 bg-destructive/10" />
        {/* Icon container with gradient + glow */}
        <div className="relative flex items-center justify-center size-20 rounded-none bg-destructive border border-destructive shadow-[5px_5px_0_hsl(var(--destructive)/0.2)]">
          <LucideTriangleAlert className="size-9 text-destructive-foreground" />
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
          <p className="mx-auto mt-1 inline-block rounded-none border border-border bg-muted/60 px-3 py-1.5 font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Action Section */}
      <Button onClick={reset} className="gap-2 rounded-none px-6 shadow-[4px_4px_0_hsl(var(--foreground)/0.12)]">
        <LucideRefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
