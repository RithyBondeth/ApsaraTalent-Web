import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* -------------------------------- Dashboard Chart Skeleton -------------------------------- */
export function DashboardChartSkeleton({
  variant = "activity",
}: {
  variant?: "activity" | "rate";
}) {
  if (variant === "rate") {
    return (
      <div className="flex min-h-[200px] flex-1 items-center justify-center">
        <Skeleton className="size-[180px] rounded-full" />
      </div>
    );
  }

  return <Skeleton className="h-[250px] w-full" />;
}

/* -------------------------------- Profile Completeness Card Skeleton -------------------------------- */
function ProfileCompletenessCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-4 border border-border bg-card px-5 py-4 sm:gap-6 sm:px-6">
      {/* Icon Section: Hidden on mobile */}
      <Skeleton className="hidden h-10 w-10 shrink-0 sm:block" />

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-10" />
        </div>
        {/* Progress Bar */}
        <Skeleton className="h-1.5 w-full" />
        {/* Status Text */}
        <Skeleton className="h-3 w-52" />
      </div>

      {/* CTA Button Section: Hidden on mobile */}
      <Skeleton className="xs:block hidden h-9 w-28 shrink-0" />
    </div>
  );
}

/* -------------------------------- Dashboard Loading Skeleton -------------------------------- */
export function DashboardLoadingSkeleton() {
  return (
    <div className="dashboard-editorial w-full" aria-busy="true">
      {/* Banner Section */}
      <PageBannerSkeleton />

      <section className="pixel-band w-full">
        <DashboardSectionHeaderSkeleton titleWidth="w-28" />

        {/* Profile Completeness Card Section */}
        <ProfileCompletenessCardSkeleton />

        {/* Statistic Card Section */}
        <div className="pixel-ruled grid-cols-2 border-x-0 border-b-0 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="mb-1 h-8 w-14 sm:h-9" />
              <Skeleton className="h-4 w-20 sm:h-5" />
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="pixel-band w-full">
        <DashboardSectionHeaderSkeleton titleWidth="w-32" />
        <div className="pixel-ruled grid-cols-1 border-x-0 border-b-0 lg:grid-cols-3">
          {/* Bar Chart Section */}
          <div className="p-6 sm:p-8 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <Skeleton className="mb-1.5 h-5 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-[250px] w-full" />
          </div>

          {/* Radial Chart Section */}
          <div className="flex flex-col p-6 sm:p-8">
            <Skeleton className="mb-1.5 h-5 w-24" />
            <Skeleton className="h-3 w-44" />
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Skeleton className="h-[180px] w-[180px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches Section */}
      <section className="pixel-band w-full">
        <DashboardSectionHeaderSkeleton titleWidth="w-40" />
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-border p-3"
              >
                <Skeleton className="size-10 shrink-0" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- Dashboard Section Header Skeleton -------------------------------- */
function DashboardSectionHeaderSkeleton({
  titleWidth,
}: {
  titleWidth: string;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-border px-6 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-5" />
        <Skeleton className={`h-7 sm:h-8 ${titleWidth}`} />
      </div>
      <Skeleton className="size-9" />
    </div>
  );
}
