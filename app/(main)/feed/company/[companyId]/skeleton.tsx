import { Skeleton } from "@/components/ui/skeleton";

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

function SkeletonSectionTitle() {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <Skeleton className="size-8 rounded-lg flex-shrink-0" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

export function CompanyDetailPageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Back Navigation Header ── */}
      <div className="border-b border-border/60 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center gap-4 py-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* ── Hero Card ── */}
      <SkeletonCard>
        {/* Cover */}
        <Skeleton className="h-44 sm:h-56 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4">
            {/* Avatar overlapping cover */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name + chips */}
            <div className="flex-1 min-w-0 pt-2 space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0 pt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* ── Content Grid ── */}
      <div className="flex items-start gap-5 tablet-lg:flex-col">
        {/* Left — main */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* About */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </SkeletonCard>

          {/* Open Positions */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
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

          {/* Career Scope */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </SkeletonCard>

          {/* Life at Company */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
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

        {/* Right — sidebar */}
        <div className="w-72 flex flex-col gap-5 tablet-lg:w-full">
          {/* Company Information */}
          <SkeletonCard className="p-5">
            <SkeletonSectionTitle />
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

          {/* Culture & Benefits */}
          <SkeletonCard className="p-5">
            <SkeletonSectionTitle />
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

          {/* Social Links */}
          <SkeletonCard className="p-5">
            <SkeletonSectionTitle />
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
