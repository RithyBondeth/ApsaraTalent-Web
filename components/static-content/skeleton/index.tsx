import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function StaticContentLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Top nav skeleton ── */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 py-3 sm:px-6">
          <Skeleton className="h-4 w-16" />
          <span className="text-border">|</span>
          <Skeleton className="h-4 w-32" />
          <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
            <Skeleton className="h-6 w-10 rounded-md" />
            <Skeleton className="h-6 w-10 rounded-md" />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:flex lg:gap-12">
        {/* ── Sticky TOC sidebar skeleton (desktop) ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 flex flex-col gap-3">
            <Skeleton className="h-3 w-20 mb-2" />
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </aside>

        {/* ── Main content skeleton ── */}
        <main className="flex-1 flex flex-col gap-10 min-w-0">
          {/* Hero header skeleton */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>

          {/* Section skeletons */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-xl shrink-0" />
                <Skeleton className="h-6 w-48" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}
