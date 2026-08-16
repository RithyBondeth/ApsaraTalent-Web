import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* -------------------------------- Matching Page Loading Skeleton -------------------------------- */
export function MatchingLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="matching-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton statCount={1} />

      {/* Matches Section */}
      <section className="pixel-band w-full">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
          <div>
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-3 h-8 w-40" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
          <Skeleton className="size-8" />
        </div>

        <div className="flex w-full flex-col items-start gap-3">
          {Array.from({ length: 3 }).map((_, index) =>
            isEmployee ? (
              <MatchingCompanyCardSkeleton key={index} />
            ) : (
              <MatchingEmployeeCardSkeleton key={index} />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- Matching Employee Card Skeleton -------------------------------- */
function MatchingEmployeeCardSkeleton() {
  return (
    <div className="w-full overflow-hidden border border-border bg-card">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Skeleton className="size-14 flex-shrink-0 sm:size-16" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="mt-1.5 h-3.5 w-20" />
            </div>
            <Skeleton className="h-6 w-24 flex-shrink-0" />
          </div>

          {/* Description Section */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section: AI Score left, Schedule+Chat right (single row on all sizes) */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-[90px]" />
          <Skeleton className="h-8 w-8 sm:w-[82px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[90px]" />
          <Skeleton className="h-8 w-[90px]" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Matching Company Card Skeleton -------------------------------- */
function MatchingCompanyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden border border-border bg-card">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Skeleton className="size-14 flex-shrink-0 sm:size-16" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
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
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section: All icon-only on mobile, labelled on sm+ */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 sm:w-[90px]" />
          {/* AI Score Section */}
          <Skeleton className="h-8 w-8 sm:w-[110px]" />
          {/* Cover Letter Section */}
          <Skeleton className="h-8 w-8 sm:w-[95px]" />
          {/* Skill Gap Section */}
          <Skeleton className="h-8 w-8 sm:w-[82px]" />
          {/* Unmatch Section */}
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8 sm:w-[90px]" />
          {/* Schedule Section */}
          <Skeleton className="h-8 w-8 sm:w-[90px]" />
          {/* Chat Now Section */}
        </div>
      </div>
    </div>
  );
}
