import { Skeleton } from "@/components/ui/skeleton";

/* ---------------------------- Notification Page Loading Skeleton ---------------------------- */
export default function NotificationLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3 p-5">
      {[...Array(5)].map((_, i) => (
        <NotificationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* -------------------------------- Notification Card Skeleton -------------------------------- */
export function NotificationCardSkeleton() {
  return (
    <div className="w-full flex items-start gap-5 p-5 shadow-md rounded-lg">
      {/* Icon Section */}
      <Skeleton className="rounded-md h-14 w-14 flex-shrink-0" />

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-2">
        {/* Header Section */}
        <div className="w-full flex items-center justify-between phone-xl:flex-col phone-xl:items-start phone-xl:gap-2">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Description Section */}
        <Skeleton className="h-4 w-full max-w-md" />

        {/* Bottom Section */}
        <div className="w-full flex items-center justify-between tablet-sm:mt-1 tablet-sm:justify-end">
          {/* Avatar and Badge Section - Hidden on tablet-sm */}
          <div className="flex items-center gap-3 tablet-sm:hidden">
            <div className="flex items-center gap-2">
              <Skeleton className="rounded-md h-8 w-8" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-14 rounded-xl" />
          </div>

          {/* Action Button Section */}
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}
