import { Skeleton } from "@/components/ui/skeleton";
import { FeedBannerSkeleton } from "@/components/feed/skeleton";

export function DashboardChartSkeleton() {
  return <Skeleton className="h-full w-full min-h-[180px] rounded-xl" />;
}

function ProfileCompletenessCardSkeleton() {
  return (
    <div className="w-full flex items-center gap-4 sm:gap-6 bg-card rounded-2xl border border-border/60 px-5 py-4 sm:px-6">
      {/* Icon Section: Hidden on mobile */}
      <Skeleton className="hidden sm:block h-10 w-10 rounded-xl shrink-0" />

      {/* Content Section */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36 rounded" />
          <Skeleton className="h-4 w-10 rounded" />
        </div>
        {/* Progress Bar */}
        <Skeleton className="w-full h-1.5 rounded-full" />
        {/* Status Text */}
        <Skeleton className="h-3 w-52 rounded" />
      </div>

      {/* CTA Button Section: Hidden on mobile */}
      <Skeleton className="hidden xs:block h-8 w-28 rounded-xl shrink-0" />
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Profile Completeness Card Section */}
      <ProfileCompletenessCardSkeleton />

      {/* Statistic Card Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-14 rounded mb-1" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bar Chart Section */}
        <div className="sm:col-span-2 lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
          <div className="flex items-start flex-wrap justify-between gap-3 mb-4">
            <div>
              <Skeleton className="h-5 w-32 rounded mb-1.5" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-3 w-12 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
              <Skeleton className="h-3 w-14 rounded" />
            </div>
          </div>
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </div>

        {/* Radial Chart Section */}
        <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 flex flex-col">
          <Skeleton className="h-5 w-24 rounded mb-1.5" />
          <Skeleton className="h-3 w-44 rounded" />
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
          </div>
        </div>
      </div>

      {/* Recent Matches Section */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4.5 w-4.5 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-border/50 p-3"
            >
              <Skeleton className="size-10 rounded-md shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-20 rounded mb-1" />
                <Skeleton className="h-3 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
