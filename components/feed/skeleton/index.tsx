import { Skeleton } from "@/components/ui/skeleton";
import CompanyCardSkeleton from "@/components/company/skeleton";
import EmployeeCardSkeleton from "@/components/employee/skeleton";

/* ------------------------- Feed Page Loading Skeleton ------------------------- */
export default function FeedPageLoadingSkeleton() {
  return (
    <div className="w-full flex flex-col items-start gap-4 sm:gap-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Recommended for You Section */}
      <FeedRecommendationsSkeleton />

      {/* All Companies/Talent Divider Section */}
      <FeedDividerSkeleton />

      {/* Feed Card Grid Section */}
      <div className="w-full columns-3 gap-x-4 laptop-sm:columns-2 tablet-lg:columns-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <CompanyCardSkeleton />
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

/* ------------------- Feed Recommendations Loading Skeleton ------------------- */
export function FeedRecommendationsSkeleton() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Title Section */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-44 rounded" />
      </div>

      {/* Card Grid Section */}
      <div className="w-full columns-3 gap-x-4 laptop-sm:columns-2 tablet-lg:columns-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <EmployeeCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------- Feed Divider Loading Skeleton ------------------------- */
export function FeedDividerSkeleton() {
  return (
    <div className="w-full flex items-center gap-4">
      {/* Icon and Label Section */}
      <div className="flex items-center gap-2 shrink-0">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-32 rounded" />
      </div>

      {/* Divider Line Section */}
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}
