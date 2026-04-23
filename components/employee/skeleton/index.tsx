import { SectionTitleSkeleton } from "@/components/utils/layout/section-title";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------- Employee Card Skeleton ------------------------- */
export default function EmployeeCardSkeleton() {
  return (
    <div className="w-full flex flex-col rounded-xl border border-muted bg-card overflow-hidden">
      {/* Header Section  */}
      <div className="flex items-start gap-3 p-4 pb-3">
        <Skeleton className="size-14 rounded-md shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <div className="flex gap-2 mt-0.5">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
          </div>
        </div>
        <Skeleton className="size-8 rounded-full shrink-0" />
      </div>

      {/* Status Badges Section */}
      <div className="flex gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Skills Section */}
      <div className="flex flex-wrap gap-1.5 px-4 pb-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>

      {/* Experience and Education Section */}
      <div className="flex flex-col gap-1.5 px-4 pb-3">
        <Skeleton className="h-3 w-40 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </div>

      {/* Description Section */}
      <div className="px-4 pb-3 space-y-1.5">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between px-4 pb-3 pt-2 border-t border-muted/50">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
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
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ---------------------- Employee Detail Page Skeleton ---------------------- */
export function EmployeeDetailPageLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Back Navigation Header Section */}
      <div className="border-b border-border/60 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <div className="flex items-center gap-4 py-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Hero Card Section */}
      <SkeletonCard>
        {/* Gradient Banner Section */}
        <Skeleton className="h-28 sm:h-36 rounded-t-2xl rounded-b-none w-full" />

        {/* Identity Section */}
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-start gap-4">
            {/* Avatar Overlapping Banner Section */}
            <Skeleton className="size-20 sm:size-24 -mt-10 sm:-mt-12 rounded-xl flex-shrink-0" />

            {/* Name, JobTitle, Availability and Chips Section */}
            <div className="flex-1 min-w-0 pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex gap-2 flex-shrink-0 pt-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Content Grid Section */}
      <div className="flex items-start gap-5 tablet-xl:flex-col">
        {/* Left Section */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {/* About Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </SkeletonCard>

          {/* Skill Tags Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 rounded-full"
                  style={{ width: `${60 + (i % 3) * 20}px` }}
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
                    <Skeleton className="size-2.5 rounded-full" />
                    {i === 0 && (
                      <Skeleton className="w-px flex-1 mt-1.5 min-h-[60px]" />
                    )}
                  </div>
                  {/* Card Section */}
                  <div className="flex-1 rounded-xl border border-border/60 p-4 space-y-2">
                    <Skeleton className="h-5 w-44" />
                    <Skeleton className="h-3.5 w-36" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>

          {/* Education Section */}
          <SkeletonCard className="p-5 sm:p-6">
            <SectionTitleSkeleton />
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border/60 p-4"
                >
                  <Skeleton className="size-9 rounded-xl flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3.5 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>

        {/* Right Section */}
        <div className="w-72 flex flex-col gap-5 tablet-xl:w-full">
          {/* Documents Section */}
          <SkeletonCard className="p-5">
            <SectionTitleSkeleton />
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
                  <Skeleton className="size-4 rounded flex-shrink-0 mt-0.5" />
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
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}
