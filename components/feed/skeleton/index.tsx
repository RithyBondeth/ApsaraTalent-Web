import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";
import EmployeeCardSkeleton from "@/components/employee/skeleton";

/* ------------ Neutral Card Skeleton (Shown Before user role is known) ------------ */
export function NeutralCardSkeleton() {
  return (
    <div className="w-full flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]">
      <div className="flex items-start gap-3 p-4 pb-3">
        <Skeleton className="size-14 rounded-md shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>
      <div className="flex gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="px-4 pb-3 space-y-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
      <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-2 border-t border-border/50">
        <Skeleton className="h-7 w-16 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

/* ------------------------- Feed Page Loading Skeleton ------------------------- */
export default function FeedPageLoadingSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <div className="w-full flex flex-col items-start gap-4 sm:gap-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Recommended for You Section */}
      <FeedRecommendationsSkeleton isEmployee={isEmployee} />

      {/* All Companies/Talent Divider Section */}
      <FeedDividerSkeleton />

      {/* Feed Card Grid Section */}
      <div className="w-full pt-2 grid grid-cols-3 gap-4 items-start laptop-sm:grid-cols-2 tablet-lg:grid-cols-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i}>
            {isEmployee === undefined ? (
              <NeutralCardSkeleton />
            ) : isEmployee ? (
              <CompanyCardSkeleton />
            ) : (
              <EmployeeCardSkeleton />
            )}
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
export function FeedRecommendationsSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Title Section */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-44 rounded" />
      </div>

      {/* Card Grid Section */}
      <div className="w-full pt-2 grid grid-cols-3 gap-4 items-start laptop-sm:grid-cols-2 tablet-lg:grid-cols-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            {isEmployee === undefined ? (
              <NeutralCardSkeleton />
            ) : isEmployee ? (
              <CompanyCardSkeleton />
            ) : (
              <EmployeeCardSkeleton />
            )}
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
