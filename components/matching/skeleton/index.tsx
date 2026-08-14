import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Matching Page Loading Skeleton -------------------------------- */
export function MatchingLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Matches Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-5 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 rounded-none" />
              <Skeleton className="h-3 w-24 rounded-none" />
            </div>
          </div>
          <Skeleton className="size-9 rounded-none" />
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
    <div className="w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)]">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Skeleton className="size-14 flex-shrink-0 rounded-none sm:size-16" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Skeleton className="h-5 w-36 rounded-none" />
              <Skeleton className="mt-1.5 h-3.5 w-20 rounded-none" />
            </div>
            <Skeleton className="h-6 w-24 flex-shrink-0 rounded-none" />
          </div>

          {/* Description Section */}
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-3/4 rounded-none" />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-none" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-none" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section: AI Score left, Schedule+Chat right (single row on all sizes) */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-[90px] rounded-none" />
          <Skeleton className="h-8 w-8 rounded-none sm:w-[82px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[90px] rounded-none" />
          <Skeleton className="h-8 w-[90px] rounded-none" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Matching Company Card Skeleton -------------------------------- */
function MatchingCompanyCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card shadow-[5px_5px_0_hsl(var(--foreground)/0.055)]">
      <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
        {/* Avatar Section */}
        <Skeleton className="size-14 flex-shrink-0 rounded-none sm:size-16" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* Header Section */}
          <div>
            <Skeleton className="h-5 w-40 rounded-none" />
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Skeleton className="h-3.5 w-24 rounded-none" />
              <Skeleton className="h-3.5 w-28 rounded-none" />
            </div>
          </div>

          {/* Description Section */}
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-3/4 rounded-none" />

          {/* Tags Section */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-none" />
            ))}
          </div>

          {/* Meta Chips Section */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-none" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar Section: All icon-only on mobile, labelled on sm+ */}
      <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/25 px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-8 rounded-none sm:w-[90px]" />
          {/* AI Score Section */}
          <Skeleton className="h-8 w-8 rounded-none sm:w-[110px]" />
          {/* Cover Letter Section */}
          <Skeleton className="h-8 w-8 rounded-none sm:w-[95px]" />
          {/* Skill Gap Section */}
          <Skeleton className="h-8 w-8 rounded-none sm:w-[82px]" />
          {/* Unmatch Section */}
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-8 w-8 rounded-none sm:w-[90px]" />
          {/* Schedule Section */}
          <Skeleton className="h-8 w-8 rounded-none sm:w-[90px]" />
          {/* Chat Now Section */}
        </div>
      </div>
    </div>
  );
}
