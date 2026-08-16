import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* ------------------------- Favorite Page Loading Skeleton ------------------------- */
export function FavoriteLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="favorite-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton statCount={1} />

      {/* Card List Section */}
      <section className="pixel-band w-full">
        {/* Saved Favorites Header Section */}
        <div className="flex w-full items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
          <div>
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-3 h-8 w-44" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <Skeleton className="size-8" />
        </div>

        {/* Favorite Cards Section */}
        <div className="flex flex-col items-start gap-3">
          {Array.from({ length: 3 }).map((_, index) =>
            isEmployee ? (
              <FavoriteCompanyCardSkeleton key={index} />
            ) : (
              <FavoriteEmployeeCardSkeleton key={index} />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------------- Favorite Company Card Loading Skeleton ---------------------- */
function FavoriteCompanyCardSkeleton() {
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

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        {/* Remove Button */}
        <Skeleton className="h-9 w-24" />
        {/* View Detail Button */}
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

/* ---------------------- Favorite Employee Card Loading Skeleton --------------------- */
function FavoriteEmployeeCardSkeleton() {
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

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        {/* Remove Button */}
        <Skeleton className="h-9 w-24" />
        {/* View Detail Button */}
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}
