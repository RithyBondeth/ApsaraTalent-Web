import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Search Company Page Loading Skeleton -------------------------------- */
export function SearchCompanyLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Search Bar Section */}
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
      {/* Company Cards Section */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
            <div className="flex gap-4">
              <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-28 mt-1.5" />
                <Skeleton className="h-3 w-20 mt-1" />
              </div>
            </div>
            {/* Meta Chips Section */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-28 rounded-full" />
              ))}
            </div>
            {/* Description Section */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          {/* Action Bar Section */}
          <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-3">
            <Skeleton className="h-7 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- Search Employee Page Loading Skeleton -------------------------------- */
export function SearchEmployeeLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Search Bar Section */}
      <Skeleton className="h-10 w-full max-w-md rounded-lg" />
      {/* Employee Cards Section */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          <div className="p-4 sm:p-5 flex flex-col gap-3.5">
            <div className="flex gap-4">
              <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-3.5 w-24 mt-1.5" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-7 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- Search Employee Card Skeleton -------------------------------- */
export function SearchEmployeeCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        {/* Header Section */}
        <div className="flex gap-4">
          <Skeleton className="size-14 sm:size-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3.5 w-28 mt-1.5" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        </div>

        {/* Meta Chips Section */}
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-7 w-28 rounded-full" />
          ))}
        </div>

        {/* Education & Experience Requirements Section */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-full" />
        </div>

        {/* Description Section */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />

        {/* Tags Section */}
        <div className="flex flex-wrap gap-1.5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}
