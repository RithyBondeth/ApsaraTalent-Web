import { Skeleton } from "@/components/ui/skeleton";
import { FeaturePageHeaderSkeleton } from "@/components/feed/skeleton";

/* ---------------------------- Notification Page Loading Skeleton ---------------------------- */
export default function NotificationLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 px-2.5 sm:px-5">
      {/* Header Section */}
      <FeaturePageHeaderSkeleton />

      {/* Header Section: Filter tabs + action buttons */}
      <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Pill Tabs Filter Section: Hidden on tablet-sm */}
        <div className="flex items-center gap-1 bg-muted/60 rounded-full p-1 overflow-x-auto scrollbar-none tablet-sm:hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded-full shrink-0" />
          ))}
        </div>
        {/* Mobile Dropdown Section: Shown only on tablet-sm */}
        <Skeleton className="hidden tablet-sm:flex h-9 w-full rounded-full" />

        {/* Action Buttons Section: Mobile: full-width split, desktop: fixed-width */}
        <div className="flex items-center gap-2 w-full sm:hidden">
          <Skeleton className="h-9 flex-1 rounded-md" />
          <Skeleton className="h-9 flex-1 rounded-md" />
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col gap-5">
        {[...Array(4)].map((_, i) => (
          <NotificationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Notification Card Skeleton -------------------------------- */
export function NotificationCardSkeleton() {
  return (
    <div className="w-full flex items-start gap-3 sm:gap-5 p-4 sm:p-5 shadow-sm border border-border rounded-xl relative overflow-hidden">
      {/* Unread Indicator Bar Section */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-1 rounded-r-full bg-muted animate-pulse" />

      {/* Icon Box Section */}
      <Skeleton className="rounded-xl h-11 w-11 sm:h-14 sm:w-14 flex-shrink-0" />

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-2">
        {/* Header Section */}
        <div className="w-full flex items-center justify-between gap-2">
          <Skeleton className="h-5 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="size-2 rounded-full" />
          </div>
        </div>

        {/* Description Section */}
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-2/3 sm:hidden" />

        {/* Bottom Section */}
        <div className="w-full flex items-center justify-between mt-2 tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="rounded-md h-8 w-8 shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-xl" />
          </div>

          <Skeleton className="h-8 w-20 rounded-md tablet-sm:h-9 tablet-sm:w-full" />
        </div>
      </div>
    </div>
  );
}
