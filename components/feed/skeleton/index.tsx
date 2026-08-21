import { PageBannerSkeleton } from "@/components/utils/layout/page-banner/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";
import EmployeeCardSkeleton from "@/components/employee/skeleton";

const FEED_CARD_GRID_CLASS =
  "w-full grid grid-cols-3 gap-4 items-stretch laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 [&>*]:min-w-0 [&>*]:h-full";

/* ------------------------- Recommended Card Skeleton ------------------------- */
function RecommendedCardSkeleton({ isEmployee }: { isEmployee?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-1.5 border-l-2 border-foreground pl-2">
        <Skeleton className="size-3 rounded-none" />
        <Skeleton className="h-2.5 w-20 rounded-none" />
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
function NeutralCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-t-[5px] border-border border-t-foreground bg-card">
      <div className="flex items-start gap-3 p-4 pb-3">
        <Skeleton className="size-16 shrink-0 rounded-none" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded-none" />
          <Skeleton className="h-3 w-20 rounded-none" />
          <Skeleton className="h-3 w-16 rounded-none" />
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Skeleton className="size-8 rounded-none" />
          <Skeleton className="size-8 rounded-none" />
        </div>
      </div>
      <div className="flex gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-16 rounded-none" />
        <Skeleton className="h-6 w-20 rounded-none" />
        <Skeleton className="h-6 w-14 rounded-none" />
      </div>
      <div className="space-y-1.5 px-4 pb-3">
        <Skeleton className="h-3 w-full rounded-none" />
        <Skeleton className="h-3 w-4/5 rounded-none" />
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-border/50 px-4 pb-3 pt-2">
        <Skeleton className="h-8 w-16 rounded-none" />
        <Skeleton className="h-8 w-16 rounded-none" />
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
    <div className="feed-scope flex w-full flex-col items-start gap-7 sm:gap-9">
      {/* Banner Section */}
      <PageBannerSkeleton stats={1} />

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

/* ------------------- Feed Recommendations Loading Skeleton ------------------- */
export function FeedRecommendationsSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-5 border-y border-border py-6">
      {/* Title Section */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-5 rounded-none" />
          <Skeleton className="h-7 w-48 rounded-none" />
        </div>
        <Skeleton className="size-5 rounded-none" />
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
    <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
      {/* Pill Badge Section */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-5 rounded-none" />
        <Skeleton className="h-7 w-32 rounded-none" />
      </div>
      {/* Divider Line Section */}
      <Skeleton className="size-9 rounded-none" />
    </div>
  );
}
