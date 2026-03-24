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

export default function EmployeeProfilePageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Hero Card ── */}
      <SkeletonCard>
        {/* Gradient banner */}
        <Skeleton className="h-28 sm:h-36 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4 tablet-md:flex-col tablet-md:items-center">
            {/* Avatar overlapping banner */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name + job title */}
            <div className="flex-1 min-w-0 pt-2 space-y-1.5 tablet-md:flex tablet-md:flex-col tablet-md:items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
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
          {/* Personal Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-col gap-5">
              {/* Firstname / Lastname row */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Username */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Gender / DOB row */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-14" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Phone */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Address */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Professional Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-col gap-5">
              {/* Job title */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              {/* Experience / Availability row */}
              <div className="flex gap-5 tablet-sm:flex-col">
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          </SkeletonCard>

          {/* Education Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Experience Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-col gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 p-4 space-y-3"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-20 w-full rounded-md" />
                  </div>
                  <div className="flex gap-5 tablet-sm:flex-col">
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right — 40% */}
        <div className="w-[40%] min-w-0 flex flex-col gap-5 tablet-lg:w-full">
          {/* Skills */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 rounded-full"
                  style={{ width: `${60 + (i % 3) * 20}px` }}
                />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Career Scopes */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* References */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-col gap-2.5">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/50 rounded-xl border border-border/40"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="size-4 flex-shrink-0" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex gap-0.5">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Social Information */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md mt-4" />
          </SkeletonCard>

          {/* Authentication */}
          <SkeletonCard className="p-5 sm:p-6">
            <SkeletonSectionTitle />
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
