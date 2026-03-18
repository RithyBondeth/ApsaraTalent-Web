import CompanyFavoriteCardSkeleton from "@/components/favorite/company-favorite-card/skeleton";
import FavoriteBannerSkeleton from "./banner-skeleton";

export default function FavoriteLoading() {
  return (
    <div className="w-full flex flex-col px-5 mt-3">
      <FavoriteBannerSkeleton />
      <div className="flex flex-col items-start gap-3 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <CompanyFavoriteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
