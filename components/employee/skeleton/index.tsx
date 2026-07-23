import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------- Employee Card Skeleton ------------------------- */
export default function EmployeeCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-none border border-border border-t-[5px] border-t-foreground bg-card">
      {/* Header Section */}
      <div className="flex items-start gap-3 p-4 pb-3 tablet-md:p-3 tablet-md:pb-2">
        <Skeleton className="size-16 shrink-0 rounded-none" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex gap-2 mt-0.5">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        </div>
        {/* Like and Quick View Buttons Section (Stacked) */}
        <div className="flex justify-end items-center gap-1 shrink-0">
          <Skeleton className="size-8 rounded-none" />
          <Skeleton className="size-8 rounded-none" />
        </div>
      </div>

      {/* Status Badges Section */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Skills Section */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-[4.5rem] rounded-full" />
      </div>

      {/* Experience and Education Section */}
      <div className="flex flex-col gap-1 px-4 pb-3">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </div>

      {/* Description Section */}
      <div className="px-4 pb-3 flex-1 space-y-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-end gap-2 px-4 pb-3 pt-2 border-t border-border/50">
        <Skeleton className="h-8 w-16 rounded-none" />
        <Skeleton className="h-8 w-16 rounded-none" />
      </div>
    </div>
  );
}

/* ------------------------- Employee Card Skeleton ------------------------- */
function SkeletonCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-border bg-card shadow-[4px_4px_0_hsl(var(--foreground)/0.035)] [&_.animate-shimmer]:rounded-none ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ---------------------- Employee Detail Page Skeleton ---------------------- */
export function EmployeeDetailPageLoadingSkeleton() {
  return (
    <div className="profile-detail-page mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-5 tablet-sm:pb-28">
      {/* Back Navigation Header Section */}
      <header className="sticky top-0 z-30 -mx-3 border-b border-border bg-background/95 px-3 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-none sm:w-24" />
          <div className="min-w-0 flex-1 space-y-1.5 border-l border-border pl-3">
            <Skeleton className="h-2.5 w-20 rounded-none" />
            <Skeleton className="h-4 w-36 rounded-none" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-none" />
        </div>
      </header>

      {/* Hero Card Section */}
      <SkeletonCard className="profile-detail-employee-card overflow-hidden">
        <div className="grid md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          {/* Editorial Identity Panel Section */}
          <section className="profile-detail-employee-intro relative flex min-h-[300px] flex-col overflow-hidden bg-foreground p-5 sm:min-h-[340px] sm:p-7 md:min-h-[410px]">
            <div className="profile-detail-hero-grid" aria-hidden />
            <div className="relative z-[2] flex items-start justify-between gap-4">
              <Skeleton className="h-2.5 w-24 rounded-none opacity-25" />
              <Skeleton className="h-7 w-28 rounded-none opacity-25" />
            </div>

            <div className="relative z-[2] mt-auto flex items-end gap-4 sm:gap-5 tablet-sm:flex-col tablet-sm:items-start">
              <Skeleton className="size-24 shrink-0 rounded-none opacity-30 sm:size-28" />
              <div className="min-w-0 flex-1 space-y-3 pb-1">
                <Skeleton className="h-2.5 w-24 rounded-none opacity-25" />
                <Skeleton className="h-10 w-4/5 max-w-80 rounded-none opacity-30 sm:h-14" />
              </div>
            </div>
          </section>

          {/* Professional Focus Panel Section */}
          <section className="profile-detail-employee-focus relative flex min-h-[320px] flex-col overflow-hidden bg-card p-5 sm:min-h-[360px] sm:p-7 md:min-h-[410px]">
            <div className="relative z-[1]">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-2.5 w-24 rounded-none" />
                <Skeleton className="h-7 w-24 rounded-none" />
              </div>
              <div className="mt-7 space-y-3 md:mt-10">
                <Skeleton className="h-10 w-5/6 rounded-none sm:h-14" />
                <Skeleton className="h-10 w-3/5 rounded-none sm:h-14" />
              </div>
            </div>

            <div className="relative z-[1] mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:mt-auto">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-h-14 bg-card p-3">
                  <Skeleton className="h-4 w-4/5 rounded-none" />
                </div>
              ))}
            </div>

            <div className="relative z-[1] mt-4 hidden justify-end gap-2 md:flex">
              <Skeleton className="h-10 w-24 rounded-none" />
              <Skeleton className="h-10 w-24 rounded-none" />
            </div>
          </section>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-5">
        {/* Left Section */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          {/* About Section */}
          <SkeletonCard className="profile-detail-employee-about p-5 sm:p-7">
            <SectionTitleSkeleton />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded-none" />
              <Skeleton className="h-5 w-11/12 rounded-none" />
              <Skeleton className="h-5 w-3/4 rounded-none" />
            </div>
          </SkeletonCard>

          {/* Skill Tags Section */}
          <SkeletonCard className="profile-detail-employee-skills p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-9 rounded-none"
                  style={{ width: `${72 + (i % 3) * 22}px` }}
                />
              ))}
            </div>
          </SkeletonCard>

          {/* Experience (Timeline) Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  {/* Timeline Dot + Line Section */}
                  <div className="flex flex-col items-center pt-1 flex-shrink-0">
                    <Skeleton className="size-2.5 rounded-none" />
                    {i === 0 && (
                      <Skeleton className="w-px flex-1 mt-1.5 min-h-[60px]" />
                    )}
                  </div>
                  {/* Card Section */}
                  <div className="profile-detail-timeline-card flex-1 space-y-2 border border-border p-4">
                    <Skeleton className="h-5 w-44 rounded-none" />
                    <Skeleton className="h-3.5 w-36 rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-4/5 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Education Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 border border-border p-4"
                >
                  <Skeleton className="size-9 flex-shrink-0 rounded-none" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-4/5 rounded-none" />
                    <Skeleton className="h-3.5 w-2/3 rounded-none" />
                    <Skeleton className="h-3.5 w-1/2 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right Section */}
        <aside className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:sticky lg:top-20">
          {/* Documents Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-2.5">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 border border-border bg-muted/50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="size-4 flex-shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-0.5">
                    <Skeleton className="size-8 rounded-none" />
                    <Skeleton className="size-8 rounded-none" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Contact Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
            <div className="space-y-3.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Skeleton className="mt-0.5 size-4 flex-shrink-0 rounded-none" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Social Links Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
          </SkeletonCard>
        </aside>
      </div>
    </div>
  );
}
