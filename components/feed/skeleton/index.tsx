import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";

/* ------------------------- Feed Page Loading Skeleton ------------------------- */
export default function FeedPageLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-4 sm:gap-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Recommended for You Section */}
      <FeedRecommendationsSkeleton />

      {/* All Companies/Talent Divider Section */}
      <FeedDividerSkeleton />

      {/* Feed Card Grid Section */}
      <div className="w-full columns-3 gap-x-4 laptop-sm:columns-2 tablet-lg:columns-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <CompanyCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------ Feed Banner Loading Skeleton ------------------------ */
export function FeedBannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-6 lg:gap-10 tablet-xl:flex-col tablet-xl:items-center rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading Section */}
        <div className="flex flex-col gap-1.5 w-full tablet-xl:items-center">
          <Skeleton className="h-8 sm:h-10 w-full max-w-sm" />
          <Skeleton className="h-8 sm:h-10 w-3/4 max-w-xs" />
        </div>

        {/* First Subheading Section */}
        <div className="tablet-xl:flex tablet-xl:justify-center w-full">
          <Skeleton className="h-5 w-72 tablet-xl:w-64" />
        </div>

        {/* Second Subheading Section */}
        <div className="tablet-xl:flex tablet-xl:justify-center w-full">
          <Skeleton className="h-5 w-80 tablet-xl:w-72" />
        </div>

        {/* Muted Text Section */}
        <div className="tablet-xl:flex tablet-xl:justify-center w-full">
          <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        </div>
      </div>

      {/* Image Section */}
      <Skeleton className="h-[240px] w-[340px] sm:h-[260px] sm:w-[360px] rounded-xl shrink-0 tablet-xl:!w-full tablet-xl:h-[200px]" />
    </div>
  );
}

/* ------------------- Feed Recommendations Loading Skeleton ------------------- */
export function FeedRecommendationsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Title Section */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-44 rounded" />
      </div>

      {/* Card Grid Section */}
      <div className="w-full columns-3 gap-x-4 laptop-sm:columns-2 tablet-lg:columns-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <CompanyCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------- Feed Divider Loading Skeleton ------------------------- */
export function FeedDividerSkeleton() {
  return (
    <div className="w-full flex items-center gap-4">
      {/* Pill Badge Section */}
      <div className="flex items-center gap-2 shrink-0 bg-card border border-border/70 rounded-full px-3 py-1.5 shadow-[0_1px_4px_hsl(var(--foreground)/0.06)]">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>

      {/* Divider Line Section */}
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}
