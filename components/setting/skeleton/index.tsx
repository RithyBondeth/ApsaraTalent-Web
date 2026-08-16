import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner";

/* -------------------------------- Setting Section Skeleton -------------------------------- */
function SettingSectionSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      {/* Section Title + Description Section */}
      <div className="flex items-start gap-3">
        <Skeleton className="size-9 shrink-0" />
        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-48 max-w-full" />
        </div>
      </div>
      <div className="overflow-hidden border border-border bg-card">
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
        <Skeleton className="size-8 shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-28" />
          {action && <Skeleton className="h-3 w-44" />}
        </div>
      </div>
      <Skeleton className="ml-11 h-7 w-20 sm:ml-0" />
    </div>
  );
}

/* -------------------------------- Setting Loading Skeleton -------------------------------- */
export default function SettingLoadingSkeleton() {
  return (
    <div className="settings-page w-full" aria-busy="true">
      <PageBannerSkeleton />

      <div className="settings-workspace grid items-start border-b border-border xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        {/* Primary account and safety column */}
        <div className="flex min-w-0 flex-col gap-7 border-b border-border p-5 sm:p-8 xl:border-b-0 xl:border-r xl:p-10">
          <SettingSectionSkeleton>
            <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-5 sm:px-5">
              <Skeleton className="size-14 shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            <SettingsRowSkeleton />
            <SettingsRowSkeleton action />
            <SettingsRowSkeleton />
            <SettingsRowSkeleton />
            <SettingsRowSkeleton action />
          </SettingSectionSkeleton>

          <SettingSectionSkeleton>
            <div className="border-l-muted-foreground/25 px-5 py-7">
              <Skeleton className="h-3 w-36" />
            </div>
          </SettingSectionSkeleton>
        </div>

        {/* Preferences and product information rail */}
        <div className="flex min-w-0 flex-col gap-7 p-5 sm:p-8 xl:p-10">
          <SettingSectionSkeleton>
            <div className="flex flex-col gap-4 p-4">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-[108px] flex-col gap-2 border-2 border-border p-3"
                  >
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="mx-auto h-3 w-12" />
                  </div>
                ))}
              </div>
              <Skeleton className="mx-auto h-3 w-44" />
            </div>
          </SettingSectionSkeleton>

          <SettingSectionSkeleton>
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-[66px] items-center gap-3 border-2 border-border px-4 py-3.5"
                >
                  <Skeleton className="size-8 shrink-0" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="size-5" />
                </div>
              ))}
            </div>
          </SettingSectionSkeleton>

          <SettingSectionSkeleton>
            <SettingsRowSkeleton />
            <SettingsRowSkeleton />
            <SettingsRowSkeleton />
          </SettingSectionSkeleton>
        </div>
      </div>
    </div>
  );
}
