"use client";

import { PageState } from "@/components/utils/feedback/page-state";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

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
    // Report top-level render crashes to Sentry (no-op when DSN is unset).
    Sentry.captureException(error);
  }, [error]);

  /* --------------------------------- Render UI -------------------------------- */
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen items-center bg-background px-4 text-foreground">
          <div className="mx-auto w-full max-w-3xl">
            <PageState
              variant="error"
              title="Application error"
              description={`A critical error occurred. Try refreshing the application.${
                error.digest ? ` Error ID: ${error.digest}` : ""
              }`}
              action={{ label: "Refresh application", onClick: reset }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
