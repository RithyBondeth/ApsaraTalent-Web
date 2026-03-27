import { Skeleton } from "@/components/ui/skeleton";

/* ----------------------- Skeleton for Favorite Page Loading ----------------------- */
export function FavoriteLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
        <div className="flex flex-col items-start gap-3 px-1 sm:px-5 tablet-xl:w-full tablet-xl:items-center">
          <Skeleton className="h-8 w-[300px] tablet-xl:w-[80%]" />
          <Skeleton className="h-6 w-[250px] tablet-xl:w-[70%]" />
          <Skeleton className="h-6 w-[280px] tablet-xl:w-[75%]" />
          <Skeleton className="h-5 w-[220px] tablet-xl:w-[60%]" />
        </div>
        <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[350px] rounded-xl tablet-xl:w-full" />
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3 mt-4">
        {[...Array(3)].map((_, index) =>
          isEmployee ? (
            <FavoriteCompanyCardSkeleton key={index} />
          ) : (
            <FavoriteEmployeeCardSkeleton key={index} />
          ),
        )}
      </div>
    </div>
  );
}

/* ----------------------- Skeleton for Company Card Loading ----------------------- */
function FavoriteCompanyCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar */}
        <Skeleton className="size-16 sm:size-20 rounded-xl flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header */}
          <div>
            <Skeleton className="h-5 w-40" />
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>

          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

/* ----------------------- Skeleton for Employee Card Loading ----------------------- */
function FavoriteEmployeeCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex gap-4 sm:gap-5">
        {/* Avatar */}
        <Skeleton className="size-16 sm:size-20 rounded-xl flex-shrink-0" />

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-20 mt-1.5" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full flex-shrink-0" />
          </div>

          {/* Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          {/* Meta Chips */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-end gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}
