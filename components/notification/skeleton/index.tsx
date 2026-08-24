import { PageBannerSkeleton } from "@/components/utils/layout/page-banner/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------------------- Notification Page Loading Skeleton ---------------------------- */
export default function NotificationLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBannerSkeleton />

      {/* Content Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-5 rounded-none" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-40 rounded-none" />
              <Skeleton className="h-3 w-28 rounded-none" />
            </div>
          </div>
          <Skeleton className="size-9 rounded-none" />
        </div>

        {/* Header Section: Filter tabs + action buttons */}
        <div className="flex w-full flex-col gap-3 border border-border bg-card p-3 shadow-hard sm:flex-row sm:items-center sm:justify-between">
          {/* Pill Tabs Filter Section: Hidden on tablet-sm */}
          <div className="scrollbar-none flex items-center gap-1 overflow-x-auto bg-muted/45 p-1 tablet-sm:hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 shrink-0 rounded-none" />
            ))}
          </div>
          {/* Mobile Dropdown Section: Shown only on tablet-sm */}
          <Skeleton className="hidden h-11 w-full rounded-none tablet-sm:flex" />

          {/* Action Buttons Section: Mobile: full-width split, desktop: fixed-width */}
          <div className="flex w-full items-center gap-2 sm:hidden">
            <Skeleton className="h-9 flex-1 rounded-none" />
            <Skeleton className="h-9 flex-1 rounded-none" />
          </div>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Skeleton className="h-9 w-32 rounded-none" />
            <Skeleton className="h-9 w-24 rounded-none" />
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
    <div className="relative flex w-full items-start gap-3 overflow-hidden rounded-none border border-border bg-card p-4 shadow-hard sm:gap-5 sm:p-5">
      {/* Unread Indicator Bar Section */}
      <div className="absolute bottom-0 left-0 top-0 w-1 animate-pulse bg-muted" />

      {/* Icon Box Section */}
      <Skeleton className="h-11 w-11 flex-shrink-0 rounded-none sm:h-14 sm:w-14" />

      {/* Content Section */}
      <div className="flex w-full flex-col items-start gap-2">
        {/* Header Section */}
        <div className="flex w-full items-center justify-between gap-2">
          <Skeleton className="h-5 w-36 rounded-none" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-20 rounded-none" />
            <Skeleton className="size-2 rounded-full" />
          </div>
        </div>

        {/* Description Section */}
        <Skeleton className="h-5 w-full max-w-md rounded-none" />
        <Skeleton className="h-5 w-2/3 rounded-none sm:hidden" />

        {/* Bottom Section */}
        <div className="mt-2 flex w-full items-center justify-between tablet-sm:flex-col tablet-sm:items-start tablet-sm:gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 shrink-0 rounded-none" />
              <Skeleton className="h-4 w-24 rounded-none" />
            </div>
            <Skeleton className="h-6 w-16 rounded-none" />
          </div>

          <Skeleton className="h-8 w-20 rounded-none tablet-sm:h-9 tablet-sm:w-full" />
        </div>
      </div>
    </div>
  );
}
