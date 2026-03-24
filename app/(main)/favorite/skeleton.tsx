import FavoriteCompanyCardSkeleton from "@/components/favorite/company-favorite-card/skeleton";
import FavoriteEmployeeCardSkeleton from "@/components/favorite/employee-favorite-card/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function FavoriteLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
        <div className="flex flex-col items-start gap-3 px-1 sm:px-5 tablet-xl:w-full tablet-xl:items-center">
          <Skeleton className="h-8 w-[300px] tablet-xl:w-[80%]" />
          <Skeleton className="h-6 w-[250px] tablet-xl:w-[70%]" />
          <Skeleton className="h-6 w-[280px] tablet-xl:w-[75%]" />
          <Skeleton className="h-5 w-[220px] tablet-xl:w-[60%]" />
        </div>
        <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[350px] rounded-xl tablet-xl:w-full" />
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-3 mt-4">
        {[...Array(3)].map((_, index) =>
          isEmployee ? (
            <FavoriteCompanyCardSkeleton key={index} />
          ) : (
            <FavoriteEmployeeCardSkeleton key={index} />
          ),
        )}
      </div>
    </div>
  );
}
