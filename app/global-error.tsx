"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { Button } from "@/components/ui/button";
import { LucideRefreshCw, LucideTriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
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

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4 bg-background text-foreground">
          {/* Alert Icon Section */}
          <div className="flex items-center justify-center size-20 rounded-full bg-red-100 dark:bg-red-950">
            <LucideTriangleAlert className="size-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Message Section */}
          <div className="flex flex-col gap-2">
            <TypographyH2 className="text-2xl font-semibold tracking-tight">
              Application error
            </TypographyH2>
            <TypographyP className="text-gray-500 text-sm max-w-sm">
              A critical error occurred. Please try refreshing the page.
            </TypographyP>
            {error.digest && (
              <TypographyMuted className="text-xs text-gray-400 font-mono mt-1">
                Error ID: {error.digest}
              </TypographyMuted>
            )}
          </div>

          {/* Refresh Button Section */}
          <Button onClick={reset} className="gap-2">
            <LucideRefreshCw className="size-4" />
            Refresh page
          </Button>
        </div>
      </body>
    </html>
  );
}
