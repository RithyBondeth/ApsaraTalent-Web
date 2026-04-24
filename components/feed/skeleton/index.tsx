import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";

/* ------------------------- Feed Page Loading Skeleton ------------------------- */
export default function FeedPageLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-4 sm:gap-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Recommended for You Section */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-44 rounded" />
        </div>
        <div className="w-full grid grid-cols-3 gap-x-4 gap-y-4 laptop-sm:grid-cols-2 laptop-sm:gap-x-3 laptop-sm:gap-y-3 tablet-lg:grid-cols-1 tablet-lg:gap-x-0 tablet-lg:gap-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* All Companies/Talent Divider Section */}
      <div className="w-full flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Feed Card Grid Section */}
      <div className="w-full grid grid-cols-3 gap-x-4 gap-y-4 laptop-sm:grid-cols-2 laptop-sm:gap-x-3 laptop-sm:gap-y-3 tablet-lg:grid-cols-1 tablet-lg:gap-x-0 tablet-lg:gap-y-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
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
