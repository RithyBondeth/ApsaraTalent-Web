import { Skeleton } from "@/components/ui/skeleton";
import { FeaturePageHeaderSkeleton } from "@/components/feed/skeleton";

function SettingSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)]">
      {/* Header Skeleton Section */}
      <div className="flex items-start gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
        <Skeleton className="size-9 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-3/4 rounded" />
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingRowsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Skeleton className="size-8 shrink-0 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28 rounded" />
              {index === 1 && <Skeleton className="h-3 w-40 rounded" />}
            </div>
          </div>
          <Skeleton className="h-7 w-20 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export default function SettingLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      {/* Header Skeleton Section */}
      <FeaturePageHeaderSkeleton />

      {/* Main Content Skeleton Section */}
      <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)] items-start gap-5 tablet-lg:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-5">
          <SettingSectionSkeleton>
            {/* Profile Card Skeleton Section */}
            <div className="flex items-center gap-4 bg-[hsl(var(--illustration-surface))] px-4 py-5 sm:px-5">
              <Skeleton className="size-14 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-48 max-w-full rounded" />
                <Skeleton className="h-5 w-16 rounded-lg" />
              </div>
            </div>
            <SettingRowsSkeleton count={5} />
          </SettingSectionSkeleton>

          {/* Quick Action Skeleton Section */}
          <SettingSectionSkeleton>
            <div className="m-5 rounded-xl border border-dashed border-border/70 p-5">
              <Skeleton className="mx-auto h-3 w-40 rounded" />
            </div>
          </SettingSectionSkeleton>
        </div>

        {/* Right Side Skeleton Section */}
        <div className="flex min-w-0 flex-col gap-5">
          <SettingSectionSkeleton>
            {/* Quick Action Skeleton Section */}
            <div className="grid grid-cols-3 gap-3 p-4 sm:p-5 phone-xl:grid-cols-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          </SettingSectionSkeleton>

          {/* Quick Action Skeleton Section */}
          <SettingSectionSkeleton>
            <div className="space-y-3 p-4 sm:p-5">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </SettingSectionSkeleton>

          {/* Quick Action Skeleton Section */}
          <SettingSectionSkeleton>
            <SettingRowsSkeleton count={3} />
          </SettingSectionSkeleton>
        </div>
      </div>
    </div>
  );
}
