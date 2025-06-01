import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LucideBookmark, LucideCircleArrowRight, LucideEye, LucideHeartHandshake } from "lucide-react";

export default function CompanyCardSkeleton() {
  return (
    <div className="h-fit w-full flex flex-col items-start gap-5 p-3 rounded-lg border border-muted animate-pulse">
      {/* Profile Section */}
      <div className="w-full flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button disabled className="size-12 rounded-full">
            <LucideEye className="!size-6 opacity-50" />
          </Button>
          <Button disabled className="size-12 rounded-full">
            <LucideHeartHandshake className="!size-6 opacity-50" />
          </Button>
        </div>
      </div>

      {/* Tags Section */}
      <div className="w-full flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-12 rounded-full" />
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />

      {/* Experience */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* Buttons */}
      <div className="w-full flex items-center justify-end gap-3">
        <Button disabled variant="outline" className="text-sm">
          Save
          <LucideBookmark className="ml-1 opacity-30" />
        </Button>
        <Button disabled variant="secondary" className="text-sm">
          View
          <LucideCircleArrowRight className="ml-1 opacity-30" />
        </Button>
      </div>
    </div>
  );
}