"use client";

import { PageState } from "@/components/utils/feedback/page-state";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function AppError({
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
    <div className="flex min-h-screen items-center bg-background px-4">
      <div className="mx-auto w-full max-w-3xl">
        <PageState
          variant="error"
          title="Something went wrong"
          description={`This page could not be displayed. Try loading it again.${
            error.digest ? ` Error ID: ${error.digest}` : ""
          }`}
          action={{ label: "Try again", onClick: reset }}
        />
      </div>
    </div>
  );
}
