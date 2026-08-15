import { Skeleton } from "@/components/ui/skeleton";
import { FeedBannerSkeleton } from "@/components/feed/skeleton";

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

  return <Skeleton className="h-[250px] w-full rounded-none" />;
}

/* -------------------------------- Profile Completeness Card Skeleton -------------------------------- */
function ProfileCompletenessCardSkeleton() {
  return (
    <div className="flex w-full items-center gap-4 border border-l-[5px] border-border border-l-foreground bg-card px-5 py-4 sm:gap-6 sm:px-6">
      {/* Icon Section: Hidden on mobile */}
      <Skeleton className="hidden h-10 w-10 shrink-0 rounded-none sm:block" />

      {/* Content Section */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36 rounded-none" />
          <Skeleton className="h-4 w-10 rounded-none" />
        </div>
        {/* Progress Bar */}
        <Skeleton className="h-1.5 w-full rounded-none" />
        {/* Status Text */}
        <Skeleton className="h-3 w-52 rounded-none" />
      </div>

      {/* CTA Button Section: Hidden on mobile */}
      <Skeleton className="xs:block hidden h-9 w-28 shrink-0 rounded-none" />
    </div>
  );
}

/* -------------------------------- Dashboard Loading Skeleton -------------------------------- */
export function DashboardLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      <section className="flex w-full flex-col gap-5">
        <DashboardSectionHeaderSkeleton titleWidth="w-28" />

        {/* Profile Completeness Card Section */}
        <ProfileCompletenessCardSkeleton />

        {/* Statistic Card Section */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-l-[5px] border-border border-l-foreground bg-card p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-9 w-9 rounded-none" />
                <Skeleton className="h-4 w-4 rounded-none" />
              </div>
              <Skeleton className="mb-1 h-8 w-14 rounded-none sm:h-9" />
              <Skeleton className="h-4 w-20 rounded-none sm:h-5" />
            </div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="flex w-full flex-col gap-5">
        <DashboardSectionHeaderSkeleton titleWidth="w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Bar Chart Section */}
          <div className="border border-t-[5px] border-border border-t-primary bg-card p-5 sm:col-span-2 sm:p-6 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <Skeleton className="mb-1.5 h-5 w-32 rounded-none" />
                <Skeleton className="h-3 w-48 rounded-none" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-3 w-12 rounded-none" />
                <Skeleton className="h-3 w-14 rounded-none" />
                <Skeleton className="h-3 w-14 rounded-none" />
              </div>
            </div>
            <Skeleton className="h-[250px] w-full rounded-none" />
          </div>

          {/* Radial Chart Section */}
          <div className="flex flex-col border border-t-[5px] border-border border-t-primary bg-card p-5 sm:p-6">
            <Skeleton className="mb-1.5 h-5 w-24 rounded-none" />
            <Skeleton className="h-3 w-44 rounded-none" />
            <div className="flex min-h-[200px] flex-1 items-center justify-center">
              <Skeleton className="h-[180px] w-[180px] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Matches Section */}
      <section className="flex w-full flex-col gap-5">
        <DashboardSectionHeaderSkeleton titleWidth="w-40" />
        <div className="border border-t-[5px] border-border border-t-primary bg-card p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border border-l-[3px] border-border border-l-foreground p-3"
              >
                <Skeleton className="size-10 shrink-0 rounded-none" />
                <div className="flex-1">
                  <Skeleton className="mb-1 h-4 w-20 rounded-none" />
                  <Skeleton className="h-3 w-14 rounded-none" />
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
    <div className="flex items-end justify-between border-b border-border pb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-5 rounded-none" />
        <Skeleton className={`h-7 rounded-none sm:h-8 ${titleWidth}`} />
      </div>
      <Skeleton className="size-9 rounded-none" />
    </div>
  );
}
