import { Skeleton } from "@/components/ui/skeleton";

export default function FavoriteBannerSkeleton() {
  return (
    <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
      <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center px-5">
        <Skeleton className="h-8 w-[300px] tablet-xl:w-[80%]" />
        <Skeleton className="h-6 w-[250px] tablet-xl:w-[70%]" />
        <Skeleton className="h-6 w-[280px] tablet-xl:w-[75%]" />
        <Skeleton className="h-5 w-[220px] tablet-xl:w-[60%]" />
      </div>
      <Skeleton className="h-[250px] w-[350px] tablet-xl:w-full" />
    </div>
  );
}
