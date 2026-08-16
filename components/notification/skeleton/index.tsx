import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* ---------------------------- Notification Page Loading Skeleton ---------------------------- */
export default function NotificationLoadingSkeleton() {
  return (
    <div className="notification-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton statCount={2} />

      {/* Content Section */}
      <section className="pixel-band w-full">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border px-6 py-5 sm:px-10">
          <div>
            <Skeleton className="h-2.5 w-28" />
            <Skeleton className="mt-3 h-8 w-40" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <Skeleton className="size-8" />
        </div>

        {/* Header Section: Filter tabs + action buttons */}
        <div className="flex w-full flex-col gap-3 border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Pill Tabs Filter Section: Hidden on tablet-sm */}
          <div className="scrollbar-none flex items-center gap-1 overflow-x-auto bg-muted/45 p-1 tablet-sm:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 shrink-0" />
            ))}
          </div>
          {/* Mobile Dropdown Section: Shown only on tablet-sm */}
          <Skeleton className="hidden h-11 w-full tablet-sm:flex" />

          {/* Action Buttons Section: Mobile: full-width split, desktop: fixed-width */}
          <div className="flex w-full items-center gap-2 sm:hidden">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        {/* Cards Section */}
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <NotificationCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- Notification Card Skeleton -------------------------------- */
export function NotificationCardSkeleton() {
  return (
    <div className="relative flex w-full items-start gap-3 overflow-hidden border border-border bg-card p-4 sm:gap-5 sm:p-5">
      {/* Unread Indicator Bar Section */}
      <div className="absolute bottom-0 left-0 top-0 w-1 animate-pulse bg-muted" />

      {/* Icon Box Section */}
      <Skeleton className="h-11 w-11 flex-shrink-0 sm:h-14 sm:w-14" />

      {/* Content Section */}
      <div className="flex w-full flex-col items-start gap-2">
        {/* Header Section */}
        <div className="flex w-full items-center justify-between gap-2">
          <Skeleton className="h-5 w-36" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="size-2 rounded-full" />
          </div>
        </div>

        {/* Description Section */}
        <Skeleton className="h-5 w-full max-w-md" />
        <Skeleton className="h-5 w-2/3 sm:hidden" />

        {/* Bottom Section */}
        <div className="mt-2 flex w-full items-center justify-between tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 shrink-0" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>

          <Skeleton className="h-8 w-20 tablet-sm:h-9 tablet-sm:w-full" />
        </div>
      </div>
    </div>
  );
}
