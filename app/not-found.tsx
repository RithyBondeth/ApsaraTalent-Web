"use client";

// `icon` hands PageState a component, and a Server Component cannot pass a
// function across the client boundary — React rejects it with "Functions cannot
// be passed directly to Client Components". Every other PageState call site is
// already inside a client tree; this route was the one server entry point, and
// it rendered a client component anyway.
import { PageState } from "@/components/utils/feedback/page-state";
import { LucideCompass } from "lucide-react";

export default function NotFound() {
  /* ------------------------------- Render UI ------------------------------ */
  return (
    <div className="flex min-h-screen items-center bg-background px-4">
      <div className="mx-auto w-full max-w-3xl">
        <PageState
          variant="empty"
          title="404 — Page not found"
          description="The page you are looking for does not exist or has been moved."
          icon={LucideCompass}
          action={{ label: "Back to Feed", href: "/feed" }}
        />
      </div>
    </div>
  );
}
