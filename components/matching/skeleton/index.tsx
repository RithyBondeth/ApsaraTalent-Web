import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Matching Page Loading Skeleton -------------------------------- */
export function MatchingLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Card List Section */}
      <div className="flex flex-col gap-3 mt-4">
        {[...Array(3)].map((_, index) =>
          isEmployee ? (
            <MatchingCompanyCardSkeleton key={index} />
          ) : (
            <MatchingEmployeeCardSkeleton key={index} />
          ),
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Matching Employee Card Skeleton -------------------------------- */
export function MatchingEmployeeCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Skeleton className="size-16 sm:size-20 rounded-xl flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-20 mt-1.5" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full flex-shrink-0" />
          </div>

          {/* Description Section */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

/* -------------------------------- Matching Company Card Skeleton -------------------------------- */
export function MatchingCompanyCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar Section */}
        <Skeleton className="size-16 sm:size-20 rounded-xl flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header Section */}
          <div>
            <Skeleton className="h-5 w-40" />
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>

          {/* Description Section */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end">
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
