"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import Image from "next/image";
import FavoriteCompanyCard from "@/components/favorite/company-favorite-card";
import FavoriteEmployeeCard from "@/components/favorite/employee-favorite-card";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  emptySvgImage,
  favoriteSvgImage,
} from "@/utils/constants/asset.constant";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";

export default function FavoritePage() {
  /* --------------------------------- Utils ---------------------------------- */
  const t = useTranslations("toast");

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const currentUser = useGetCurrentUserStore((state) => state.user);

  // Get All Employee and Company Favorites
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();

  // Remove Employee and Company Favorites
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();

  // Count All Employee and Company Favorites
  const countCurrentCmpFavoritesStore = useCountCurrentCompanyFavoritesStore();
  const countCurrentEmpFavoritesStore = useCountCurrentEmployeeFavoritesStore();

  // Liked Users (To Filter Out From Favorites — Backend Auto-Removes But This Is A Safety Net)
  const { currentEmployeeLiked } = useGetCurrentEmployeeLikedStore();
  const { currentCompanyLiked } = useGetCurrentCompanyLikedStore();

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState(false);
  // Track IDs that are currently being removed (for animation)
  const [removingFavIds, setRemovingFavIds] = useState<Set<string>>(new Set());

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmployee = currentUser?.role === "employee";

  // Always fetch fresh data on every mount so liked items are never stale
  useEffect(() => {
    if (!currentUser) return;
    if (isEmployee && currentUser.employee?.id) {
      getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
        currentUser.employee.id,
      );
      countCurrentEmpFavoritesStore.countCurrentEmpFavorites(
        currentUser.employee.id,
      );
    } else if (!isEmployee && currentUser.company?.id) {
      getAllCompanyFavoritesStore.queryAllCompanyFavorites(
        currentUser.company.id,
      );
      countCurrentCmpFavoritesStore.countCurrentCmpFavorites(
        currentUser.company.id,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.employee?.id, currentUser?.company?.id]);

  // Filter Out Liked Users From Favorites (Safety Net For Stale Data)
  const filteredEmployeeFavorites = useMemo(() => {
    const data = getAllEmployeeFavoritesStore.companyData;
    if (!data) return null;
    if (!currentEmployeeLiked || currentEmployeeLiked.length === 0) return data;
    const likedIds = new Set(currentEmployeeLiked.map((c) => c.id));
    return data.filter((fav) => !likedIds.has(fav.company.id));
  }, [getAllEmployeeFavoritesStore.companyData, currentEmployeeLiked]);

  const filteredCompanyFavorites = useMemo(() => {
    const data = getAllCompanyFavoritesStore.employeeData;
    if (!data) return null;
    if (!currentCompanyLiked || currentCompanyLiked.length === 0) return data;
    const likedIds = new Set(currentCompanyLiked.map((e) => e.id));
    return data.filter((fav) => !likedIds.has(fav.employee.id));
  }, [getAllCompanyFavoritesStore.employeeData, currentCompanyLiked]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Load Remove Animation Then Remove ─────────────────────────────────────────
  const animateThenRemove = useCallback(
    (favId: string, removeFn: () => Promise<void>) => {
      // Start card-pop-shrink animation
      setRemovingFavIds((prev) => new Set(prev).add(favId));
      // After animation completes (400ms), run the actual removal
      setTimeout(async () => {
        try {
          await removeFn();
        } finally {
          setRemovingFavIds((prev) => {
            const next = new Set(prev);
            next.delete(favId);
            return next;
          });
        }
      }, 400);
    },
    [],
  );

  // ── Handle Employee Remove Company From Favorite ─────────────────────────────────
  const handleEmployeeRemoveCompanyFromFavorite = useCallback(
    (
      employeeID: string,
      companyID: string,
      favoriteID: string,
      companyName: string,
    ) => {
      if (!employeeID || !companyID || !favoriteID) return;
      animateThenRemove(favoriteID, async () => {
        try {
          await employeeFavCompanyStore.removeCompanyFromFavorite(
            employeeID,
            companyID,
            favoriteID,
          );
          countCurrentEmpFavoritesStore.countCurrentEmpFavorites(employeeID);
          toast.success(t("removedFromFavorites", { name: companyName }));
          await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
            employeeID,
          );
        } catch {
          const err =
            employeeFavCompanyStore.empFavError || t("failedToRemoveFavorite");
          toast.error(err);
        }
      });
    },
    [
      animateThenRemove,
      employeeFavCompanyStore,
      countCurrentEmpFavoritesStore,
      getAllEmployeeFavoritesStore,
      t,
    ],
  );

  // ── Handle Company Remove Employee From Favorite ───────────────────────────────────
  const handleCompanyRemoveEmployeeFromFavorite = useCallback(
    (
      companyID: string,
      employeeID: string,
      favoriteID: string,
      employeeName: string,
    ) => {
      if (!companyID || !employeeID || !favoriteID) return;
      animateThenRemove(favoriteID, async () => {
        try {
          await companyFavEmployeeStore.removeEmployeeFromFavorite(
            companyID,
            employeeID,
            favoriteID,
          );
          countCurrentCmpFavoritesStore.countCurrentCmpFavorites(companyID);
          toast.success(t("removedFromFavorites", { name: employeeName }));
          await getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyID);
        } catch {
          const err =
            companyFavEmployeeStore.cmpFavError || t("failedToRemoveFavorite");
          toast.error(err);
        }
      });
    },
    [
      animateThenRemove,
      companyFavEmployeeStore,
      countCurrentCmpFavoritesStore,
      getAllCompanyFavoritesStore,
      t,
    ],
  );

  /* ------------------------------- Loading State ------------------------------ */
  const isLoadingForEmployee =
    isEmployee &&
    (getAllEmployeeFavoritesStore.loading ||
      getAllEmployeeFavoritesStore.companyData === null);

  const isLoadingForCompany =
    !isEmployee &&
    (getAllCompanyFavoritesStore.loading ||
      getAllCompanyFavoritesStore.employeeData === null);

  const isLoading =
    !mounted || !currentUser || isLoadingForEmployee || isLoadingForCompany;

  if (isLoading) return <FavoriteLoadingSkeleton isEmployee={isEmployee} />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5 animate-page-in">
      {/* Banner Section */}
      <div className="w-full flex items-center justify-between gap-4 sm:gap-5 tablet-xl:flex-col tablet-xl:items-center">
        {/* Content Section */}
        <div className="flex flex-col items-start gap-3 px-1 sm:px-5 tablet-xl:mt-2 tablet-xl:w-full tablet-xl:items-center">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            Find your favorites at a Glance
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Quick access to the companies and talents you&apos;ve saved
          </TypographyH4>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Review, connect, and take the next step whenever you&apos;re ready
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            Your personal shortlist — organized in one place.
          </TypographyMuted>
        </div>

        {/* Image Poster Section */}
        {mounted && (
          <Image
            src={favoriteSvgImage}
            alt="favorites"
            height={250}
            width={350}
            className="h-auto max-w-[320px] tablet-xl:!w-full"
          />
        )}
      </div>

      {/* Favorite Card List Section */}
      <div className="flex flex-col items-start gap-3 stagger-list">
        {isEmployee &&
        filteredEmployeeFavorites &&
        filteredEmployeeFavorites.length > 0 ? (
          filteredEmployeeFavorites.map((fav) => (
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
              isRemoving={removingFavIds.has(fav.id)}
              onRemoveFromFavorite={() => {
                if (currentUser && currentUser.employee) {
                  handleEmployeeRemoveCompanyFromFavorite(
                    currentUser.employee.id,
                    fav.company.id,
                    fav.id,
                    fav.company.name,
                  );
                }
              }}
            />
          ))
        ) : !isEmployee &&
          filteredCompanyFavorites &&
          filteredCompanyFavorites.length > 0 ? (
          filteredCompanyFavorites.map((fav) => (
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
              isRemoving={removingFavIds.has(fav.id)}
              onRemoveFromFavorite={() => {
                if (currentUser && currentUser.company) {
                  handleCompanyRemoveEmployeeFromFavorite(
                    currentUser.company.id,
                    fav.employee.id,
                    fav.id,
                    fav.employee.username ??
                      `${fav.employee.firstname} ${fav.employee.lastname}`,
                  );
                }
              }}
            />
          ))
        ) : (
          /* Empty Favorite List */
          <div className="w-full flex flex-col items-center justify-center my-16">
            <Image
              src={emptySvgImage}
              alt="empty"
              height={200}
              width={200}
              className="animate-float"
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              Favorite List Empty
            </TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
