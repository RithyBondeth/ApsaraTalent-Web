import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";
import EmployeeCardSkeleton from "@/components/employee/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

const FEED_CARD_GRID_CLASS =
  "pixel-ruled w-full grid-cols-3 items-stretch border-x-0 laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 [&>*]:min-w-0 [&>*]:h-full";

/* ------------------------- Recommended Card Skeleton ------------------------- */
function RecommendedCardSkeleton({ isEmployee }: { isEmployee?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-1.5 border-l-2 border-foreground pl-2">
        <Skeleton className="size-3" />
        <Skeleton className="h-2.5 w-20" />
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
    <div className="flex h-full w-full flex-col overflow-hidden bg-card">
      <div className="flex items-start gap-3 p-4">
        <Skeleton className="size-14 shrink-0" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="flex shrink-0 gap-1">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </div>

      <div className="grid grid-cols-2 border-y border-border">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="min-w-0 border-border px-4 py-3 [&+&]:border-l"
          >
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="mt-1.5 h-4 w-20" />
          </div>
        ))}
      </div>

      <div className="border-b border-border px-4 py-3">
        <Skeleton className="mb-2 h-2.5 w-12" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-14" />
        </div>
      </div>

      <div className="flex-1 space-y-1.5 px-4 py-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
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
    <div className="feed-scope w-full" aria-busy="true">
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
  return <PageBannerSkeleton statCount={2} />;
}

/* ------------------- Feed Recommendations Loading Skeleton ------------------- */
export function FeedRecommendationsSkeleton({
  isEmployee,
}: {
  isEmployee?: boolean;
}) {
  return (
    <section className="pixel-band w-full">
      {/* Title Section */}
      <div className="flex items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
        <div>
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="mt-3 h-8 w-48" />
        </div>
        <Skeleton className="size-8" />
      </div>

      {/* Card Grid Section */}
      <div className={FEED_CARD_GRID_CLASS}>
        {Array.from({ length: 3 }).map((_, i) => (
          <RecommendedCardSkeleton key={i} isEmployee={isEmployee} />
        ))}
      </div>
    </section>
  );
}

/* --------------------- Feed Divider Loading Skeleton ------------------------- */
export function FeedDividerSkeleton() {
  return (
    <div className="flex w-full items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
      {/* Pill Badge Section */}
      <div>
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="mt-3 h-8 w-32" />
      </div>
      {/* Divider Line Section */}
      <Skeleton className="size-9" />
    </div>
  );
}
