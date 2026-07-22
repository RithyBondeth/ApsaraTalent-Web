import { Skeleton } from "@/components/ui/skeleton";

export default function StaticContentLoadingSkeleton() {
  /* ----------------------------- Render UI ----------------------------- */
  return (
    <div className="landing-scope min-h-screen bg-background text-foreground">
      {/* Loading Skeleton for Top Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-36 rounded-none" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-40 rounded-none" />
            <Skeleton className="size-10 rounded-none" />
          </div>
        </div>
      </header>

      {/* Loading Skeleton for Banner */}
      <section className="border-b border-border pt-[72px]">
        <div className="mx-auto grid min-h-[420px] max-w-7xl border-x border-border lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14">
            <Skeleton className="h-3 w-40 rounded-none" />
            <Skeleton className="mt-6 h-12 w-3/4 rounded-none" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-5/6 rounded-none" />
              <Skeleton className="h-4 w-3/5 rounded-none" />
            </div>
          </div>
          <div className="landing-swap-panel hidden items-center justify-center border-l border-border lg:flex">
            <div className="relative grid h-[205px] w-[350px] max-w-[80%] place-items-center border border-[hsl(var(--landing-panel-ink)/0.15)]">
              <Skeleton className="size-20 rounded-none bg-[hsl(var(--landing-panel-ink)/0.1)]" />
            </div>
          </div>
        </div>
      </section>

      {/* Loading Skeleton for Main Content */}
      <div className="mx-auto grid max-w-7xl border-x border-border lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border p-8 lg:block">
          <Skeleton className="mb-5 h-3 w-20 rounded-none" />
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex gap-3 border-t border-border py-4 last:border-b"
            >
              <Skeleton className="h-3 w-5 rounded-none" />
              <Skeleton className="h-3 flex-1 rounded-none" />
            </div>
          ))}
        </aside>

        {/* Loading Skeleton for Main Content */}
        <main className="min-w-0">
          {/* Loading Skeleton for List Content Sections */}
          {[...Array(3)].map((_, i) => (
            <section
              key={i}
              className="grid gap-6 border-b border-border px-6 py-16 sm:grid-cols-[64px_minmax(0,1fr)] sm:px-10 lg:px-14"
            >
              <Skeleton className="size-14 rounded-none" />
              <div>
                <Skeleton className="h-3 w-16 rounded-none" />
                <Skeleton className="mt-4 h-8 w-2/3 rounded-none" />
                <div className="mt-8 space-y-4">
                  <Skeleton className="h-4 w-full rounded-none" />
                  <Skeleton className="h-4 w-full rounded-none" />
                  <Skeleton className="h-4 w-4/5 rounded-none" />
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
