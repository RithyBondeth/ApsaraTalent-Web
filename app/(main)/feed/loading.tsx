import BannerSkeleton from "./banner-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedLoading() {
  return (
    <div className="mt-3 flex w-full flex-col px-2.5 sm:px-5">
      <BannerSkeleton />
      <div className="flex flex-col items-start gap-3 p-2 sm:p-3 mt-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-full flex items-start gap-5 p-5 shadow-md rounded-md">
            <Skeleton className="size-16 rounded-md shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2 mt-1">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
