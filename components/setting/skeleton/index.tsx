import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------- Setting Section Skeleton -------------------------------- */
function SettingSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      {/* Section Title + Description Section */}
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 shrink-0 rounded-none" />
        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
          <Skeleton className="h-4 w-28 rounded-none" />
          <Skeleton className="h-3 w-48 max-w-full rounded-none" />
        </div>
      </div>
      <div className="overflow-hidden border border-border bg-card shadow-hard">
        {children}
      </div>
    </section>
  );
}

/* -------------------------------- Setting Row Skeleton -------------------------------- */
function SettingsRowSkeleton({ action = false }: { action?: boolean }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
      <div className="flex items-center gap-3">
        <Skeleton className="size-8 shrink-0 rounded-none" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-28 rounded-none" />
          {action && <Skeleton className="h-3 w-44 rounded-none" />}
        </div>
      </div>
      <Skeleton className="ml-11 h-7 w-20 rounded-none sm:ml-0" />
    </div>
  );
}

/* -------------------------------- Setting Loading Skeleton -------------------------------- */
export default function SettingLoadingSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Page Header Section */}
      <div className="border border-border bg-card px-5 py-7 shadow-hard sm:px-7 sm:py-9">
        <div className="flex items-start gap-4 sm:gap-5">
          <Skeleton className="size-11 shrink-0 rounded-none sm:size-12" />
          <div className="flex flex-1 flex-col gap-2.5">
            <Skeleton className="h-2.5 w-20 rounded-none" />
            <Skeleton className="h-9 w-40 rounded-none sm:h-10 sm:w-52" />
            <Skeleton className="h-4 w-[430px] max-w-full rounded-none" />
          </div>
        </div>
      </div>

      {/* Appearance Section: 3 Theme Option Cards Section */}
      <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-8">
        <SettingSectionSkeleton>
          <div className="flex flex-col gap-4 p-4">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[108px] flex-col gap-2 border-2 border-border p-3"
                >
                  <Skeleton className="h-14 w-full rounded-none" />
                  <Skeleton className="mx-auto h-3 w-12 rounded-none" />
                </div>
              ))}
            </div>
            <Skeleton className="mx-auto h-3 w-44 rounded-none" />
          </div>
        </SettingSectionSkeleton>

        {/* Language Section: 2 Language Buttons Section */}
        <SettingSectionSkeleton>
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex h-[66px] items-center gap-3 border-2 border-border px-4 py-3.5"
              >
                <Skeleton className="size-8 shrink-0 rounded-none" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-20 rounded-none" />
                  <Skeleton className="h-3 w-24 rounded-none" />
                </div>
                <Skeleton className="size-5 rounded-none" />
              </div>
            ))}
          </div>
        </SettingSectionSkeleton>
      </div>

      {/* Account Section: Avatar Row + Setting Rows Section */}
      <SettingSectionSkeleton>
        {/* Avatar + Name + Email Section */}
        <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-5 sm:px-5">
          <Skeleton className="size-14 shrink-0 rounded-none" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 rounded-none" />
            <Skeleton className="h-3 w-48 rounded-none" />
            <Skeleton className="h-5 w-16 rounded-none" />
          </div>
        </div>
        {/* Setting Rows Section */}
        <SettingsRowSkeleton />
        <SettingsRowSkeleton action />
        <SettingsRowSkeleton />
        <SettingsRowSkeleton />
        <SettingsRowSkeleton action />
      </SettingSectionSkeleton>

      {/* Blocked Users and About Section */}
      <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-8">
        {/* Blocked Users Section */}
        <SettingSectionSkeleton>
          <div className="border-l-[4px] border-l-muted-foreground/25 px-5 py-7">
            <Skeleton className="h-3 w-36 rounded-none" />
          </div>
        </SettingSectionSkeleton>

        {/* About Section */}
        <SettingSectionSkeleton>
          <SettingsRowSkeleton />
          <SettingsRowSkeleton />
          <SettingsRowSkeleton />
        </SettingSectionSkeleton>
      </div>
    </div>
  );
}
