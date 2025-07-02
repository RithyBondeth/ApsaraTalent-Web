import { Skeleton } from "@/components/ui/skeleton";

export function BannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        <Skeleton className="h-8 w-[400px] tablet-xl:w-full tablet-xl:h-10" />
        <Skeleton className="h-6 w-[350px] tablet-xl:w-3/4" />
        <Skeleton className="h-6 w-[300px] tablet-xl:w-2/3" />
        <Skeleton className="h-5 w-[250px] tablet-xl:w-1/2" />
      </div>
      <Skeleton className="h-[300px] w-[400px] tablet-xl:w-full" />
    </div>
  );
}