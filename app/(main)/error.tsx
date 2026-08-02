"use client";

import { PageState } from "@/components/utils/feedback/page-state";
import * as Sentry from "@sentry/nextjs";
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
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-4">
      <PageState
        variant="error"
        title="Something went wrong"
        description={`An unexpected error occurred. Try this page again.${
          error.digest ? ` Error ID: ${error.digest}` : ""
        }`}
        action={{ label: "Try again", onClick: reset }}
      />
    </div>
  );
}
