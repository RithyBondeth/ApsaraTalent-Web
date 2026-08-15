import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------- Favorite Page Loading Skeleton ------------------------- */
export function FavoriteLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Card List Section */}
      <section className="flex w-full flex-col gap-5">
        {/* Saved Favorites Header Section */}
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-5 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-44 rounded-none" />
              <Skeleton className="h-3 w-28 rounded-none" />
            </div>
          </div>
          <Skeleton className="size-9 rounded-none" />
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
    <div className="w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card">
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

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        {/* Remove Button */}
        <Skeleton className="h-9 w-24 rounded-none" />
        {/* View Detail Button */}
        <Skeleton className="h-9 w-28 rounded-none" />
      </div>
    </div>
  );
}

/* ---------------------- Favorite Employee Card Loading Skeleton --------------------- */
function FavoriteEmployeeCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-card">
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

      {/* Action Bar Section */}
      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/25 px-4 py-3 sm:px-5">
        {/* Remove Button */}
        <Skeleton className="h-9 w-24 rounded-none" />
        {/* View Detail Button */}
        <Skeleton className="h-9 w-28 rounded-none" />
      </div>
    </div>
  );
}
