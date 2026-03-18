import MatchingCompanyCardSkeleton from "@/components/matching/matching-company-card/skeleton";
import MatchingBannerSkeleton from "./banner-skeleton";

export default function MatchingLoading() {
  return (
    <div className="w-full flex flex-col px-5 mt-3">
      <MatchingBannerSkeleton />
      <div className="flex flex-col items-start gap-3 p-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <MatchingCompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
