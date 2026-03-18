import CompanyCardSkeleton from "@/components/company/company-card/skeleton";
import BannerSkeleton from "./banner-skeleton";

export default function FeedLoading() {
  return (
    <div className="w-full flex flex-col items-start gap-5">
      <BannerSkeleton />
      <div className="w-full grid grid-cols-3 gap-5 laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 phone-xl:gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
