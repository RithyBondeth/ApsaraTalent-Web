import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { TUserRole } from "@/utils/types/auth";

export default function InterviewLoadingSkeleton({
  role,
}: {
  role?: TUserRole;
}) {
  const isCompany = role === USER_ROLE.COMPANY;

  return (
    <div className="w-full flex flex-col gap-4 px-2.5 sm:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Create Interview Button Section (Company Only) */}
      {isCompany && (
        <div className="flex items-center justify-end">
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>
      )}

      {/* Interview Cards Section */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden"
        >
          {/* Card Body Section */}
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            {/* Header Row Section: Title + Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-36" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
            </div>
            {/* Description Section (line-clamp-2) */}
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            {/* Meta Pills Section: Date, Duration, Location/Link */}
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>

          {/* Action Bar Section (Employee always has AI prep footer; Company has no footer (conditional on pending+received)) */}
          {!isCompany && (
            <div className="px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center gap-2">
              <Skeleton className="h-8 w-36 rounded-md" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
