import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPageLoadingSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="mt-3 flex w-full flex-col px-2.5 sm:px-5">
      <FeedBannerSkeleton />
      <div className="flex flex-col items-start gap-3 p-2 sm:p-3 mt-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-full flex items-start gap-5 p-5 shadow-md rounded-md"
          >
            <Skeleton className="size-16 rounded-md shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeedBannerSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-8 w-96 tablet-xl:w-80" />
        </div>

        {/* First Subheading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-8 w-72 tablet-xl:w-64" />
        </div>

        {/* Second Subheading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-6 w-80 tablet-xl:w-72" />
        </div>

        {/* Muted Text Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        </div>
      </div>

      {/* Image Skeleton */}
      <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[350px] tablet-xl:!w-full rounded-lg" />
    </div>
  );
}
