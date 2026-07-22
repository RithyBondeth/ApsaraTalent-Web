import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";
import { Skeleton } from "../../ui/skeleton";

/* --------------------------- Company Card Skeleton ---------------------------- */
export default function CompanyCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden border border-border bg-card">
      {/* Cover Banner Section */}
      <div className="relative h-32 w-full shrink-0 bg-gradient-to-br from-muted via-background to-muted/40 tablet-md:h-24">
        {/* Like and Quick View Buttons Section */}
        <div className="absolute top-2 right-2 flex justify-center items-center gap-1">
          <Skeleton className="size-8 rounded-none" />
          <Skeleton className="size-8 rounded-none" />
        </div>
      </div>

      {/* Avatar Section */}
      <div className="z-10 -mt-7 flex items-end justify-between gap-3 px-4 tablet-md:-mt-6">
        <Skeleton className="size-16 rounded-none border-4 border-card tablet-md:size-14" />
      </div>

      <div className="flex flex-1 flex-col gap-2 tablet-md:gap-1.5 px-4 pt-2 pb-3">
        {/* Name and Meta Section */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32 rounded" />
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-[4.5rem] rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>

        {/* Open Positions Section */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28 rounded" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Benefits Section */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-[4.5rem] rounded-full" />
          <Skeleton className="h-6 w-[5.5rem] rounded-full" />
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-end gap-2 px-4 pb-3 border-t border-border/50 pt-3">
        <Skeleton className="h-8 w-16 rounded-none" />
        <Skeleton className="h-8 w-16 rounded-none" />
      </div>
    </div>
  );
}

/* --------------------------- Skeleton Card ---------------------------- */
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

/* ------------------- Company Detail Page Skeleton ------------------- */
export function CompanyDetailPageLoadingSkeleton() {
  return (
    <div className="profile-detail-page mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-5 tablet-sm:pb-28">
      {/* Back Navigation Header Section */}
      <header className="sticky top-0 z-30 -mx-3 border-b border-border bg-background/95 px-3 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
        <div className="mx-auto flex h-16 max-w-7xl min-w-0 items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-none sm:w-24" />
          <div className="min-w-0 flex-1 space-y-1.5 border-l border-border pl-3">
            <Skeleton className="h-2.5 w-20 rounded-none" />
            <Skeleton className="h-4 w-40 rounded-none" />
          </div>
          <Skeleton className="size-10 shrink-0 rounded-none" />
        </div>
      </header>

      {/* Hero Card Section */}
      <SkeletonCard className="profile-detail-company-card overflow-hidden">
        {/* Brand Cover Section */}
        <section className="profile-detail-hero profile-detail-company-cover relative flex min-h-[300px] flex-col overflow-hidden bg-foreground p-5 sm:min-h-[360px] sm:p-8">
          <div className="profile-detail-hero-grid" aria-hidden />
          <div className="relative z-[2] flex items-start justify-between gap-4">
            <Skeleton className="h-2.5 w-24 rounded-none opacity-25" />
            <Skeleton className="h-8 w-28 rounded-none opacity-25" />
          </div>

          <div className="relative z-[2] mt-auto max-w-4xl space-y-4 pb-10 sm:pb-0">
            <Skeleton className="h-3 w-36 rounded-none opacity-25" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-4/5 max-w-3xl rounded-none opacity-30 sm:h-14" />
              <Skeleton className="h-10 w-1/2 max-w-xl rounded-none opacity-30 sm:h-14" />
            </div>
          </div>
        </section>

        {/* Identity and Metadata Rail Section */}
        <div className="relative grid gap-5 px-4 pb-5 sm:px-6 sm:pb-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-end">
          <Skeleton className="size-24 -mt-12 rounded-none border-[3px] border-card sm:size-28 sm:-mt-14" />

          <div className="grid min-w-0 grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 md:mb-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-h-[3.25rem] bg-card p-3">
                <Skeleton className="h-4 w-4/5 rounded-none" />
              </div>
            ))}
          </div>

          <div className="hidden shrink-0 gap-2 md:mb-1 md:flex">
            <Skeleton className="h-10 w-24 rounded-none" />
            <Skeleton className="h-10 w-24 rounded-none" />
          </div>
        </div>

        <div className="h-1 bg-foreground" aria-hidden />
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-5">
        {/* Left: Main Section */}
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
          {/* About Section */}
          <SkeletonCard className="profile-detail-company-about p-5 sm:p-7">
            <SectionTitleSkeleton />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full rounded-none" />
              <Skeleton className="h-5 w-11/12 rounded-none" />
              <Skeleton className="h-5 w-4/5 rounded-none" />
            </div>
          </SkeletonCard>

          {/* Open Positions Section */}
          <SkeletonCard className="profile-detail-company-positions p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-8 rounded-none" />
                <Skeleton className="h-5 w-36 rounded-none" />
              </div>
              <Skeleton className="size-8 rounded-none" />
            </div>
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="profile-detail-position-card space-y-3 border border-border p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-44 rounded-none" />
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-24 rounded-none" />
                        <Skeleton className="h-7 w-20 rounded-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32 rounded-none" />
                      <Skeleton className="h-4 w-32 rounded-none" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full rounded-none" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton className="h-4 w-4/5 rounded-none" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-7 w-16 rounded-none" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Career Scope Section */}
          <SkeletonCard className="profile-detail-company-scope p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-none" />
              ))}
            </div>
          </SkeletonCard>

          {/* Company Images Section */}
          <SkeletonCard className="profile-detail-company-gallery p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-52 w-72 flex-shrink-0 rounded-none"
                />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: Sidebar Section */}
        <aside className="flex min-w-0 flex-col gap-4 sm:gap-5 lg:sticky lg:top-20">
          {/* Company Information Section */}
          <SkeletonCard className="profile-detail-company-information p-5">
            <SectionTitleSkeleton />
            <div className="space-y-3.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Skeleton className="mt-0.5 size-4 flex-shrink-0 rounded-none" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Values & Benefits Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-3 w-14 mb-2" />
                <div className="flex flex-col gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-none" />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <div className="flex flex-col gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-none" />
                  ))}
                </div>
              </div>
            </div>
          </SkeletonCard>

          {/* Social Links Section*/}
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
