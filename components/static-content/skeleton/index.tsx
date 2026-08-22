import { Skeleton } from "@/components/ui/skeleton";
import { PageBannerSkeleton } from "@/components/utils/layout/page-banner/skeleton";

/* -------------------------------- Static Content Loading Skeleton Section -------------------------------- */
export default function StaticContentLoadingSkeleton({
  sectionCount = 5,
  hasMeta = false,
}: {
  sectionCount?: number;
  hasMeta?: boolean;
}) {
  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="landing-scope min-h-screen bg-background text-foreground">
      {/* Loading Skeleton for Top Navigation Section */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-36 rounded-none" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-40 rounded-none" />
            <Skeleton className="size-10 rounded-none" />
          </div>
        </div>
      </header>

      {/* Loading Skeleton for Banner Section */}
      {/* Mirrors StaticPageShell's hero: the same grid band, the same max-w-7xl
          bordered column, and PageBanner's own placeholder inside it. `hasMeta`
          means the page supplies banner stats. */}
      <section className="relative overflow-hidden border-b border-border pt-[72px]">
        <div className="relative mx-auto max-w-7xl border-x border-border px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
          <PageBannerSkeleton stats={hasMeta ? 3 : 0} />
        </div>
      </section>

      {/* Loading Skeleton for Main Content Section */}
      <div className="mx-auto max-w-7xl border-x border-border">
        <div className="flex gap-1 overflow-hidden border-b border-border p-3 lg:hidden">
          {Array.from({ length: Math.min(sectionCount, 5) }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-none" />
          ))}
        </div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-border lg:block">
            <div className="p-8">
              <Skeleton className="mb-5 h-3 w-20 rounded-none" />
              {Array.from({ length: sectionCount }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[28px_1fr] gap-2 border-t border-border py-3 last:border-b"
                >
                  <Skeleton className="h-3 w-5 rounded-none" />
                  <Skeleton className="h-3 w-full rounded-none" />
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0">
            {Array.from({ length: sectionCount }).map((_, index) => (
              <section
                key={index}
                className="border-b border-border px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
              >
                <div className="grid gap-6 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-8">
                  <Skeleton className="size-12 rounded-none sm:size-14" />
                  <div>
                    <Skeleton className="h-3 w-16 rounded-none" />
                    <Skeleton className="mt-2 h-8 w-2/3 rounded-none" />
                    <div className="mt-6 space-y-4">
                      <Skeleton className="h-4 w-full rounded-none" />
                      <Skeleton className="h-4 w-full rounded-none" />
                      <Skeleton className="h-4 w-4/5 rounded-none" />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>

      {/* Loading Skeleton for Footer Section */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl border-x border-border px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-12 w-36 rounded-none" />
              <Skeleton className="h-3 w-64 max-w-full rounded-none" />
              <Skeleton className="h-3 w-52 max-w-full rounded-none" />
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3 md:gap-x-16">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex w-24 flex-col gap-3">
                  <Skeleton className="h-4 w-20 rounded-none" />
                  <Skeleton className="h-3 w-16 rounded-none" />
                  <Skeleton className="h-3 w-20 rounded-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14 flex justify-between border-t border-border pt-6">
            <Skeleton className="h-3 w-52 rounded-none" />
            <Skeleton className="h-3 w-36 rounded-none" />
          </div>
        </div>
      </footer>
    </div>
  );
}
