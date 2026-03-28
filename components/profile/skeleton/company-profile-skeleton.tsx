import { Skeleton } from "@/components/ui/skeleton";
import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";

function SkeletonCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function CompanyProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Hero Card ── */}
      <SkeletonCard>
        {/* Cover image */}
        <Skeleton className="h-44 sm:h-56 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar overlapping cover */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name + industry */}
            <div className="flex-1 min-w-0 pt-2 space-y-1.5 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Edit button */}
            <div className="flex gap-2 flex-shrink-0 pt-2">
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* ── Content Grid ── */}
      <div className="flex items-start gap-5 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        {/* Left — 60% */}
        <div className="w-[60%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-5">
              {/* Company Name */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              {/* Industry / Size row */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Website */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Phone */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Location */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Open Positions */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Company Images */}
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

        {/* Right — 40% */}
        <div className="w-[40%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Benefits */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Values */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Career Scopes */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Social Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Authentication */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-muted/30 rounded-xl py-3 px-3"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-[30px] rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
              {/* Email/Password */}
              <div className="space-y-3 mt-2">
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
