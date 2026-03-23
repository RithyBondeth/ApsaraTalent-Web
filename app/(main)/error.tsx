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
  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    console.error(error);
  }, [error]);

  /* --------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="flex items-center justify-center size-20 rounded-full bg-destructive/10">
        <LucideTriangleAlert className="size-10 text-destructive" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          An unexpected error occurred. You can try again or go back to the
          previous page.
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground/60 font-mono mt-1">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <Button onClick={reset} className="gap-2">
        <LucideRefreshCw className="size-4" />
        Try again
      </Button>
    </div>
  );
}
