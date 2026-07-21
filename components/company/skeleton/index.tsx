import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";
import { Skeleton } from "../../ui/skeleton";

/* --------------------------- Company Card Skeleton ---------------------------- */
export default function CompanyCardSkeleton() {
  return (
    <div className="flex h-full min-h-72 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_1px_2px_hsl(var(--foreground)/0.03),0_8px_24px_hsl(var(--foreground)/0.03)]">
      {/* Company Card Skeleton Section */}
      <div className="flex items-start gap-3.5 px-5 pb-3 pt-5">
        <Skeleton className="size-14 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
        <Skeleton className="size-10 shrink-0 rounded-xl" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-4/5 rounded" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-20 rounded-lg" />
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 pt-4">
          <Skeleton className="h-11 rounded-xl" />
          <Skeleton className="h-11 rounded-xl" />
        </div>
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
      className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ------------------- Company Detail Page Skeleton ------------------- */
export function CompanyDetailPageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Back Navigation Header Section */}
      <div className="-mx-3 border-b border-border/70 px-3 sm:-mx-4 sm:px-4 lg:-mx-5 lg:px-5">
        <div className="flex items-center gap-3 py-2.5">
          <Skeleton className="h-9 w-16 rounded-xl" />
          <Skeleton className="h-5 w-px" />
          <Skeleton className="h-4 w-36 rounded" />
        </div>
      </div>

      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Compact Cover Section */}
        <Skeleton className="h-28 w-full rounded-none sm:h-32" />

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar Overlapping Cover Section */}
            <Skeleton className="-mt-9 size-20 flex-shrink-0 rounded-xl sm:-mt-10 sm:size-24" />

            {/* Name and Chips Section */}
            <div className="min-w-0 flex-1 space-y-2 pt-3 tablet-md:w-full tablet-md:pt-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            </div>

            {/* Action Button Section */}
            <div className="flex gap-2 flex-shrink-0 pt-3 tablet-md:hidden">
              <Skeleton className="h-10 w-20 rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="flex items-start gap-5 tablet-lg:flex-col">
        {/* Left: Main Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* About Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </SkeletonCard>

          {/* Open Positions Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-44" />
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-20 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-7 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Career Scope Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </SkeletonCard>

          {/* Company Images Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex gap-3 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-44 w-60 rounded-xl flex-shrink-0"
                />
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right: Sidebar Section */}
        <div className="w-72 flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
            <div className="space-y-3.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Skeleton className="size-4 rounded flex-shrink-0 mt-0.5" />
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
                    <Skeleton key={i} className="h-9 w-full rounded-lg" />
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-3 w-16 mb-2" />
                <div className="flex flex-col gap-1.5">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full rounded-lg" />
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
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
