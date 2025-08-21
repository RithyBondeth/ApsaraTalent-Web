"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import Image from "next/image";
import favoriteSvgImage from "@/assets/svg/favorite.svg";
import emptySvgImage from "@/assets/svg/empty.svg";
import { useEffect } from "react";

import FavoriteEmployeeCardSkeleton from "@/components/favorite/employee-favorite-card/skeleton";
import FavoriteCompanyCardSkeleton from "@/components/favorite/company-favorite-card/skeleton";
import FavoriteCompanyCard from "@/components/favorite/company-favorite-card";
import FavoriteEmployeeCard from "@/components/favorite/employee-favorite-card";
import FavoriteBannerSkeleton from "./banner-skeleton";

export default function FavoritePage() {
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const userLoading = useGetCurrentUserStore((state) => state.loading);
  const isInitialized = useGetCurrentUserStore((state) => state.isInitialized);
  const isEmployee = currentUser?.role === "employee";

  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  

  useEffect(() => {
    if (!currentUser) return;
    if (isEmployee && currentUser.employee) {
      getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
        currentUser.employee.id
      );
    }
    if (!isEmployee && currentUser.company) {
      getAllCompanyFavoritesStore.queryAllCompanyFavorites(
        currentUser.company.id
      );
    }
  }, [currentUser, isEmployee]);

  // Unified loading handling to avoid flicker before first fetch resolves
  const isLoadingForEmployee =
    isEmployee &&
    (getAllEmployeeFavoritesStore.loading ||
      getAllEmployeeFavoritesStore.companyData === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getAllCompanyFavoritesStore.loading ||
      getAllCompanyFavoritesStore.employeeData === null);

  const shouldShowLoading =
    !isInitialized || userLoading || isLoadingForEmployee || isLoadingForCompany;

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
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center px-5">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            Your Favorites at a Glance
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Quick access to the companies and talents you’ve saved
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Review, connect, and take the next step whenever you’re ready
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
              name={fav.company.name}
              avatar={fav.company.avatar ?? ""}
              industry={fav.company.industry}
              description={fav.company.description}
              companySize={fav.company.companySize}
              foundedYear={fav.company.foundedYear}
              openPosition={fav.company.openPositions ?? []}
              location={fav.company.location}
              onViewClick={() => {}}
            />
          ))
        ) : !isEmployee &&
          getAllCompanyFavoritesStore.employeeData &&
          getAllCompanyFavoritesStore.employeeData.length > 0 ? (
          getAllCompanyFavoritesStore.employeeData.map((fav) => (
            <FavoriteEmployeeCard
              key={fav.id}
              name={`${fav.employee.firstname} ${fav.employee.lastname}`}
              username={fav.employee.username ?? ""}
              avatar={fav.employee.avatar ?? ""}
              description={fav.employee.description}
              position={fav.employee.job}
              experience={fav.employee.yearsOfExperience}
              availability={fav.employee.availability}
              location={fav.employee.location ?? ""}
              skills={(fav.employee.skills ?? []).map((skill) => skill.name)}
              onViewClick={() => {}}
            />
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center mt-14">
            <Image
              src={emptySvgImage}
              alt="empty"
              height={200}
              width={200}
              className="tablet-xl:!w-full"
            />
            <TypographyH4>There&apos;s no favorite.</TypographyH4>
          </div>
        )}
      </div>
    </div>
  );
}
