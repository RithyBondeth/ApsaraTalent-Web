import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------- Feed Page Loading Skeleton ------------------------- */
export default function FeedPageLoadingSkeleton() {
  return (
    <div className="mt-3 flex w-full flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />
      {/* Card List Section */}
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

/* ------------------------ Feed Banner Loading Skeleton ------------------------ */
export function FeedBannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading Section */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-8 w-96 tablet-xl:w-80" />
        </div>

        {/* First Subheading Section */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-8 w-72 tablet-xl:w-64" />
        </div>

        {/* Second Subheading Section */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-6 w-80 tablet-xl:w-72" />
        </div>

        {/* Muted Text Section */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        </div>
      </div>

      {/* Image Section */}
      <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[350px] tablet-xl:!w-full rounded-lg" />
    </div>
  );
}
