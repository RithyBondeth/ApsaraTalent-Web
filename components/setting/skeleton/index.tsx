import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Setting Section Skeleton -------------------------------- */
function SettingSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section Title + Description Section */}
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      {children}
    </div>
  );
}

/* -------------------------------- Setting Loading Skeleton -------------------------------- */
export default function SettingLoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 px-3 py-6 sm:px-5 sm:py-8">
      {/* Page Header Section */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Appearance Section: 3 theme option cards */}
      <SettingSectionSkeleton>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </SettingSectionSkeleton>

      {/* Language Section: 2 language buttons */}
      <SettingSectionSkeleton>
        <div className="flex gap-3">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 flex-1 rounded-xl" />
        </div>
      </SettingSectionSkeleton>

      {/* Account Section: avatar row + setting rows */}
      <SettingSectionSkeleton>
        {/* Avatar + Name + Email Section */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/60 bg-card">
          <Skeleton className="size-14 rounded-full flex-shrink-0" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        {/* Setting Rows Section */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 px-4 rounded-xl border border-border/60 bg-card"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg flex-shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-lg flex-shrink-0" />
          </div>
        ))}
      </SettingSectionSkeleton>

      {/* About Section */}
      <SettingSectionSkeleton>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </SettingSectionSkeleton>
    </div>
  );
}
