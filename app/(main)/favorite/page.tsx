"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import Image from "next/image";
import favoriteSvgImage from "@/assets/svg/favorite.svg";
import emptySvgImage from "@/assets/svg/empty.svg";

import FavoriteEmployeeCardSkeleton from "@/components/favorite/employee-favorite-card/skeleton";
import FavoriteCompanyCardSkeleton from "@/components/favorite/company-favorite-card/skeleton";
import FavoriteCompanyCard from "@/components/favorite/company-favorite-card";
import FavoriteEmployeeCard from "@/components/favorite/employee-favorite-card";
import FavoriteBannerSkeleton from "./banner-skeleton";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useFetchOnce } from "@/hooks/use-fetch-once";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useToast } from "@/hooks/use-toast";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { LucideBookmarkX } from "lucide-react";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

export default function FavoritePage() {
  // Utils
  const { toast } = useToast();

  // API calls
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const countAllCompanyFavoritesStore = useCountAllCompanyFavoritesStore();
  const countAllEmployeeFavoritesStore = useCountAllEmployeeFavoritesStore();

  // Fetch user-specific favorites data
  const { isEmployee } = useFetchOnce({
    cacheKey: "favorite-page",
    onEmployeeFetch: (employeeId) => {
      getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(employeeId);
    },
    onCompanyFetch: (companyId) => {
      getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyId);
    },
  });

  // Handle Employee Remove Company From Favorite
  const handleEmployeeRemoveCompanyFromFavorite = async (
    employeeID: string,
    companyID: string,
    favoriteID: string,
    companyName: string
  ) => {
    if (!employeeID || !companyID || !favoriteID) return;
    try {
      await employeeFavCompanyStore.removeCompanyFromFavorite(
        employeeID,
        companyID,
        favoriteID
      );
      countAllEmployeeFavoritesStore.countAllEmployeeFavorites(employeeID);
      toast({
        variant: "success",
        description: (
          <div className="flex items-center gap-2">
            <LucideBookmarkX />
            <TypographySmall className="font-medium leading-relaxed">
              {companyName} removed from favorites.
            </TypographySmall>
          </div>
        ),
      });
      await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(employeeID);
    } catch (error) {
      const err =
        employeeFavCompanyStore.error ||
        "Failed to remove company from favorites.";
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    }
  };

  // Handle Company Remove Employee From Favorite
  const handleCompanyRemoveEmployeeFromFavorite = async (
    companyID: string,
    employeeID: string,
    favoriteID: string,
    employeeName: string
  ) => {
    if (!companyID || !employeeID || !favoriteID) return;
    try {
      await companyFavEmployeeStore.removeEmployeeFromFavorite(
        companyID,
        employeeID,
        favoriteID
      );
      countAllCompanyFavoritesStore.countAllCompanyFavorites(companyID);
      toast({
        variant: "success",
        description: (
          <div className="flex items-center gap-2">
            <LucideBookmarkX />
            <TypographySmall className="font-medium leading-relaxed">
              {employeeName} removed from favorites.
            </TypographySmall>
          </div>
        ),
      });
      await getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyID);
    } catch (error) {
      const err =
        companyFavEmployeeStore.error ||
        "Failed to remove employee from favorites.";
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    }
  };

  // Unified loading handling to avoid flicker before first fetch resolves
  const isLoadingForEmployee =
    isEmployee &&
    (getAllEmployeeFavoritesStore.loading ||
      getAllEmployeeFavoritesStore.companyData === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getAllCompanyFavoritesStore.loading ||
      getAllCompanyFavoritesStore.employeeData === null);

  const shouldShowLoading = isLoadingForEmployee || isLoadingForCompany;

  if (shouldShowLoading) {
    return (
      <div className="w-full flex flex-col px-5 mt-3">
        <FavoriteBannerSkeleton />
        <div className="flex flex-col items-start gap-3 p-3">
          {[...Array(3)].map((_, index) =>
            isEmployee ? (
              <FavoriteCompanyCardSkeleton key={index} />
            ) : (
              <FavoriteEmployeeCardSkeleton key={index} />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col px-5">
      <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center tablet-xl:mt-5 px-5">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            Find your favorites at a Glance
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Quick access to the companies and talents you've saved
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Review, connect, and take the next step whenever you're ready
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            Your personal shortlist — organized in one place.
          </TypographyMuted>
        </div>
        <Image
          src={favoriteSvgImage}
          alt="favorites"
          height={250}
          width={350}
          className="tablet-xl:!w-full"
        />
      </div>
      <div className="flex flex-col items-start gap-3">
        {isEmployee &&
        getAllEmployeeFavoritesStore.companyData &&
        getAllEmployeeFavoritesStore.companyData.length > 0 ? (
          getAllEmployeeFavoritesStore.companyData.map((fav) => (
            <FavoriteCompanyCard
              key={fav.id}
              id={fav.company.id}
              name={fav.company.name}
              avatar={fav.company.avatar ?? ""}
              industry={fav.company.industry}
              description={fav.company.description}
              companySize={fav.company.companySize}
              foundedYear={fav.company.foundedYear}
              openPosition={fav.company.openPositions ?? []}
              location={fav.company.location}
              onRemoveFromFavorite={() => {
                if (currentUser && currentUser.employee) {
                  const employeeID = currentUser.employee.id;
                  const companyID = fav.company.id;
                  const favoriteID = fav.id;
                  const companyName = fav.company.name;

                  handleEmployeeRemoveCompanyFromFavorite(
                    employeeID,
                    companyID,
                    favoriteID,
                    companyName
                  );
                }
              }}
            />
          ))
        ) : !isEmployee &&
          getAllCompanyFavoritesStore.employeeData &&
          getAllCompanyFavoritesStore.employeeData.length > 0 ? (
          getAllCompanyFavoritesStore.employeeData.map((fav) => (
            <FavoriteEmployeeCard
              key={fav.id}
              id={fav.employee.id}
              name={`${fav.employee.firstname} ${fav.employee.lastname}`}
              username={fav.employee.username ?? ""}
              avatar={fav.employee.avatar ?? ""}
              description={fav.employee.description}
              position={fav.employee.job}
              experience={fav.employee.yearsOfExperience}
              availability={fav.employee.availability}
              location={fav.employee.location ?? ""}
              skills={(fav.employee.skills ?? []).map((skill) => skill.name)}
              onRemoveFromFavorite={() => {
                if (currentUser && currentUser.company) {
                  const companyID = currentUser.company.id;
                  const employeeID = fav.employee.id;
                  const favoriteID = fav.id;
                  const employeeName =
                    fav.employee.username ??
                    `${fav.employee.firstname} ${fav.employee.lastname}`;

                  handleCompanyRemoveEmployeeFromFavorite(
                    companyID,
                    employeeID,
                    favoriteID,
                    employeeName
                  );
                }
              }}
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image src={emptySvgImage} alt="empty" height={200} width={200} />
            <TypographyP className="!m-0">No favorited available</TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
