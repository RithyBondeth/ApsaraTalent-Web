import MatchingCompanyCardSkeleton from "@/components/matching/matching-company-card/skeleton";
import MatchingEmployeeCardSkeleton from "@/components/matching/matching-employee-card/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function MatchingLoadingSkeleton({
  isEmployee,
}: {
  isEmployee: boolean;
}) {
  return (
    <div className="mt-3 flex w-full flex-col px-2.5 sm:px-5">
      <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
        <div className="flex flex-col items-start gap-3 px-2 sm:px-5 tablet-xl:w-full tablet-xl:items-center">
          <Skeleton className="h-8 w-[300px] tablet-xl:w-[80%]" />
          <Skeleton className="h-6 w-[250px] tablet-xl:w-[70%]" />
          <Skeleton className="h-6 w-[280px] tablet-xl:w-[75%]" />
          <Skeleton className="h-5 w-[220px] tablet-xl:w-[60%]" />
        </div>
        <Skeleton className="h-[220px] w-[300px] sm:h-[250px] sm:w-[350px] tablet-xl:w-full" />
      </div>
      <div className="flex flex-col items-start gap-3 p-2 sm:p-3">
        {[...Array(3)].map((_, index) =>
          isEmployee ? (
            <MatchingCompanyCardSkeleton key={index} />
          ) : (
            <MatchingEmployeeCardSkeleton key={index} />
          ),
        )}
      </div>
    </div>
  );
}
