import { Skeleton } from "@/components/ui/skeleton";

export default function BannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-8 w-96 tablet-xl:w-80" />
        </div>

        {/* First Subheading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-6 w-72 tablet-xl:w-64" />
        </div>

        {/* Second Subheading Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-6 w-80 tablet-xl:w-72" />
        </div>

        {/* Muted Text Skeleton */}
        <div className="tablet-xl:text-center w-full tablet-xl:flex tablet-xl:justify-center">
          <Skeleton className="h-4 w-64 tablet-xl:w-56" />
        </div>
      </div>

      {/* Image Skeleton */}
      <Skeleton className="h-[300px] w-[400px] tablet-xl:!w-full rounded-lg" />
    </div>
  );
}
