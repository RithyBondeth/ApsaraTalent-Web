import { Skeleton } from "@/components/ui/skeleton";

const FEATURED_GRID_CLASS =
  "grid w-full grid-flow-col auto-cols-[86%] gap-4 overflow-hidden sm:auto-cols-[48%] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3";

const DISCOVERY_GRID_CLASS = "grid w-full grid-cols-1 gap-4 lg:grid-cols-2";

export function NeutralCardSkeleton() {
  return (
    <div className="flex h-full min-h-72 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.03),0_8px_24px_hsl(var(--foreground)/0.03)]">
      {/* Header Skeleton Section */}
      <div className="flex items-start gap-3.5 px-5 pb-3 pt-5">
        <Skeleton className="size-14 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="size-10 shrink-0 rounded-xl" />
      </div>

      {/* Content Skeleton Section */}
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function FeedPageLoadingSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <div
      className="flex w-full flex-col gap-7"
      data-feed-role={
        isEmployee === undefined
          ? "unknown"
          : isEmployee
            ? "employee"
            : "company"
      }
    >
      {/* Feed Page Skeleton Section */}
      <FeedBannerSkeleton />

      {/* Feed Recommendations Section */}
      <FeedRecommendationsSkeleton isEmployee={isEmployee} />

      {/* Feed Divider Section */}
      <FeedDividerSkeleton />

      {/* Feed Discovery Section */}
      <div className={DISCOVERY_GRID_CLASS}>
        {Array.from({ length: 4 }).map((_, index) => (
          <NeutralCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function FeedBannerSkeleton() {
  return (
    <div className="grid w-full gap-7 border-b border-border/80 pb-7 pt-1 sm:pb-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
      {/* Main Content Skeleton Section */}
      <div>
        <Skeleton className="h-4 w-28 rounded" />
        <Skeleton className="mt-3 h-9 w-4/5 max-w-xl rounded sm:h-11" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-lg rounded" />
        <Skeleton className="mt-5 h-12 w-full max-w-2xl rounded-xl" />
      </div>

      {/* Right Side Skeleton Section */}
      <div className="hidden pb-1 lg:block">
        <Skeleton className="h-3 w-20 rounded" />
        <div className="mt-4 grid grid-cols-2 gap-5">
          <div className="border-l-2 border-border pl-4">
            <Skeleton className="h-9 w-14 rounded" />
            <Skeleton className="mt-2 h-3 w-20 rounded" />
          </div>
          <div className="border-l-2 border-border pl-4">
            <Skeleton className="h-9 w-14 rounded" />
            <Skeleton className="mt-2 h-3 w-20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturePageHeaderSkeleton() {
  return (
    <div className="flex w-full items-start gap-4 border-b border-border/80 pb-5 pt-1 sm:pb-6">
      {/* Icon Skeleton Section */}
      <Skeleton className="size-10 shrink-0 rounded-xl sm:size-11" />

      {/* Text Skeleton Section */}
      <div className="min-w-0 flex-1 pt-0.5">
        <Skeleton className="h-7 w-56 max-w-3/4 rounded" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-xl rounded" />
      </div>
    </div>
  );
}

export function FeedRecommendationsSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <div
      className="flex w-full flex-col gap-4"
      data-card-type={
        isEmployee === undefined
          ? "unknown"
          : isEmployee
            ? "company"
            : "employee"
      }
    >
      {/* Header Skeleton Section */}
      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-6 w-36 rounded" />
        </div>
        <Skeleton className="mt-2 h-4 w-72 max-w-full rounded" />
      </div>
      {/* Card Grid Skeleton Section */}
      <div className={FEATURED_GRID_CLASS}>
        {Array.from({ length: 3 }).map((_, index) => (
          <NeutralCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

/* --------------------- Feed Divider Loading Skeleton ------------------------- */
export function FeedDividerSkeleton() {
  return (
    <div className="flex w-full items-end justify-between gap-4">
      {/* Pill Badge Section */}
      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-6 w-40 rounded" />
        </div>
        <Skeleton className="mt-2 h-4 w-20 rounded" />
      </div>
      {/* Divider Line Section */}
      <Skeleton className="h-11 w-36 rounded-xl" />
    </div>
  );
}
