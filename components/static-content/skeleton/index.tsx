import { Skeleton } from "@/components/ui/skeleton";

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
      <section className="relative overflow-hidden border-b border-border pt-[72px]">
        <div className="mx-auto grid min-h-[420px] max-w-7xl border-x border-border lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="flex items-center gap-3">
              <Skeleton className="h-px w-8 rounded-none" />
              <Skeleton className="h-3 w-32 rounded-none" />
            </div>
            <Skeleton className="mt-6 h-12 w-3/4 rounded-none" />
            <div className="mt-5 space-y-3">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-5/6 rounded-none" />
              <Skeleton className="h-4 w-3/5 rounded-none" />
            </div>
            {hasMeta && (
              <div className="mt-6 flex items-center gap-2">
                <Skeleton className="size-3.5 rounded-none" />
                <Skeleton className="h-3 w-40 rounded-none" />
              </div>
            )}
          </div>
          <div className="landing-swap-panel relative flex min-h-[350px] flex-col overflow-hidden border-t border-border p-6 sm:p-8 lg:min-h-0 lg:border-l lg:border-t-0 lg:p-9">
            <div className="flex items-center justify-between">
              <Skeleton className="h-2.5 w-24 rounded-none opacity-20" />
              <Skeleton className="h-2.5 w-12 rounded-none opacity-20" />
            </div>
            <div className="my-auto flex items-center justify-center py-6">
              <div className="relative grid h-[205px] w-[350px] max-w-[80%] place-items-center border border-[hsl(var(--landing-panel-ink)/0.15)]">
                <Skeleton className="size-20 rounded-none bg-[hsl(var(--landing-panel-ink)/0.1)]" />
              </div>
            </div>
            <div className="border-t border-[hsl(var(--landing-panel-ink)/0.16)]">
              <Skeleton className="my-4 h-2.5 w-20 rounded-none opacity-20" />
              <div className="grid grid-cols-2 border-t border-[hsl(var(--landing-panel-ink)/0.16)]">
                {Array.from({ length: Math.min(sectionCount, 4) }).map((_, index) => (
                  <div key={index} className="flex min-h-14 items-center gap-3 border-b border-[hsl(var(--landing-panel-ink)/0.16)] px-3 odd:border-r">
                    <Skeleton className="h-2.5 w-4 rounded-none opacity-20" />
                    <Skeleton className="h-3 flex-1 rounded-none opacity-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                <div key={index} className="grid grid-cols-[28px_1fr] gap-2 border-t border-border py-3 last:border-b">
                  <Skeleton className="h-3 w-5 rounded-none" />
                  <Skeleton className="h-3 w-full rounded-none" />
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0">
            {Array.from({ length: sectionCount }).map((_, index) => (
              <section key={index} className="border-b border-border px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
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
