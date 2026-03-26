"use client";

import { Skeleton } from "../../ui/skeleton";

export default function CompanyCardSkeleton() {
  return (
    <div className="w-full flex flex-col rounded-xl border border-muted bg-card">
      <div className="flex flex-col gap-3 px-4 pt-4 pb-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Skeleton className="size-12 rounded-md shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-4 w-28 rounded" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
          <div className="flex gap-1">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="size-8 rounded-full" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-4 pb-3">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}
