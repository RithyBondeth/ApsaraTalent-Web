import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";
import EmployeeCardSkeleton from "@/components/employee/skeleton";

const FEED_CARD_GRID_CLASS =
  "w-full pt-2 grid grid-cols-3 gap-4 items-stretch laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 [&>*]:min-w-0 [&>*]:h-full";

function RecommendedCardSkeleton({ isEmployee }: { isEmployee?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 mb-1.5 px-1">
        <Skeleton className="size-3 rounded" />
        <Skeleton className="h-2.5 w-16 rounded" />
      </div>
      {isEmployee === undefined ? (
        <NeutralCardSkeleton />
      ) : isEmployee ? (
        <CompanyCardSkeleton />
      ) : (
        <EmployeeCardSkeleton />
      )}
    </div>
  );
}

/* ------------ Neutral Card Skeleton (Shown Before user role is known) ------------ */
export function NeutralCardSkeleton() {
  return (
    <div className="h-full w-full flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden shadow-[0_2px_8px_hsl(var(--foreground)/0.05)]">
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
      <div className={FEED_CARD_GRID_CLASS}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex h-full flex-col">
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
    <>
      {/* Desktop Skeleton Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-8 sm:h-10 w-72 sm:w-96" />
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64" />
          </div>
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-[240px] w-[340px] sm:h-[260px] sm:w-[360px] rounded-xl shrink-0" />
      </div>

      {/* Tablet Skeleton Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <Skeleton className="h-7 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
        <Skeleton className="size-[160px] rounded-xl shrink-0" />
      </div>

      {/* Mobile Skeleton Section ≤650px */}
      <div className="hidden tablet-md:flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-3 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
        <Skeleton className="size-[88px] rounded-xl shrink-0" />
      </div>
    </>
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
      <div className={FEED_CARD_GRID_CLASS}>
        {Array.from({ length: 3 }).map((_, i) => (
          <RecommendedCardSkeleton key={i} isEmployee={isEmployee} />
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
