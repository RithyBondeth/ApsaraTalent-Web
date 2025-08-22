import { Skeleton } from "@/components/ui/skeleton";

export function BannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
        {/* Main Heading - Match TypographyH2 */}
        <Skeleton className="h-8 w-full max-w-[500px] tablet-xl:w-4/5 tablet-md:w-full rounded" />
        {/* Subheading 1 - Match TypographyH4 */}
        <Skeleton className="h-6 w-full max-w-[450px] tablet-xl:w-3/4 tablet-md:w-5/6 rounded" />
        {/* Subheading 2 - Match TypographyH4 */}
        <Skeleton className="h-6 w-full max-w-[420px] tablet-xl:w-2/3 tablet-md:w-4/5 rounded" />
        {/* Description - Match TypographyMuted */}
        <Skeleton className="h-5 w-full max-w-[380px] tablet-xl:w-3/5 tablet-md:w-3/4 rounded" />
      </div>
      {/* Banner Image - Match Image component behavior */}
      <div className="flex-shrink-0">
        <Skeleton className="h-[300px] w-[400px] tablet-xl:!w-full tablet-xl:h-[250px] tablet-md:h-[200px] rounded-lg" />
      </div>
    </div>
  );
}
