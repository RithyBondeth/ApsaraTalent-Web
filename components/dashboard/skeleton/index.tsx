import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col items-start gap-2">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-6 w-64 rounded" />
      </div>

      {/* Statistic Card Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5 animate-pulse"
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart Section */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 p-5 sm:p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
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

        {/* Radial chart */}
        <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 animate-pulse flex flex-col">
          <Skeleton className="h-5 w-24 rounded mb-1.5" />
          <Skeleton className="h-3 w-44 rounded" />
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
          </div>
        </div>
      </div>

      {/* Recent matches */}
      <div className="bg-card rounded-2xl border border-border/60 p-5 sm:p-6 animate-pulse">
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
