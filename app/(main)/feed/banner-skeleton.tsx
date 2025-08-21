import { Skeleton } from "@/components/ui/skeleton";

export function BannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading */}
        <Skeleton className="h-8 w-[400px] tablet-xl:w-4/5 tablet-md:w-full rounded" />
        {/* Subheading */}
        <Skeleton className="h-6 w-[350px] tablet-xl:w-3/4 tablet-md:w-5/6 rounded" />
        {/* Additional text line */}
        <Skeleton className="h-6 w-[300px] tablet-xl:w-2/3 tablet-md:w-4/5 rounded" />
        {/* Description */}
        <Skeleton className="h-5 w-[250px] tablet-xl:w-3/5 tablet-md:w-3/4 rounded" />
      </div>
      {/* Banner Image */}
      <Skeleton className="h-[300px] w-[400px] tablet-xl:!w-full tablet-md:h-[200px] rounded-lg" />
    </div>
  );
}