import { FeedBannerSkeleton } from "@/components/feed/skeleton";
import MatchingCompanyCardSkeleton from "@/components/matching/matching-company-card/skeleton";
import MatchingEmployeeCardSkeleton from "@/components/matching/matching-employee-card/skeleton";

export interface IMatchingLoadingSkeletonProps {
  isEmployee: boolean;
}

export default function MatchingLoadingSkeleton({
  isEmployee,
}: IMatchingLoadingSkeletonProps) {
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5">
      {/* Banner Section */}
      <FeedBannerSkeleton />

      {/* Card List */}
      <div className="flex flex-col gap-3 mt-4">
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
