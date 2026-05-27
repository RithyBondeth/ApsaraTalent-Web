"use client";

import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyH3 } from "@/components/utils/typography/typography-h3";
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
import { emptySvg, favoriteBannerSvg } from "@/utils/constants/asset.constant";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { USER_ROLE } from "@/utils/constants/auth.constant";

interface Props {
  initialIsEmployee: boolean;
}

export default function FavoritePageClient({ initialIsEmployee }: Props) {
  /* --------------------------------- Utils ---------------------------------- */
  const t = useTranslations("toast");
  const tFav = useTranslations("favorite");

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

  // Liked Users (To Filter Out From Favorites)
  const { currentEmployeeLiked } = useGetCurrentEmployeeLikedStore();
  const { currentCompanyLiked } = useGetCurrentCompanyLikedStore();

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  // Track IDs that are currently being removed (for animation)
  const [removingFavIds, setRemovingFavIds] = useState<Set<string>>(new Set());

  // User Role
  const isEmployee = currentUser?.role === USER_ROLE.EMPLOYEE;
  const skeletonIsEmployee = initialIsEmployee;

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  // Always Fetch Fresh Data On Every Mount So Liked Items Are Never Stale
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
  // ── Load Remove Animation Then Remove ─────────────────────────────────
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

  // ── Handle Employee Remove Company From Favorite ────────────────────────
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

  // ── Handle Company Remove Employee From Favorite ────────────────────────
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

  if (isLoading)
    return <FavoriteLoadingSkeleton isEmployee={skeletonIsEmployee} />;

  /* ------------------------------- Error State -------------------------------- */
  const apiError = isEmployee
    ? getAllEmployeeFavoritesStore.error
    : getAllCompanyFavoritesStore.error;

  if (apiError)
    return (
      <div className="w-full px-2.5 sm:px-5 py-10 flex flex-col items-center justify-center gap-3">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center max-w-md w-full">
          <TypographyP className="text-sm font-medium text-destructive">
            {apiError}
          </TypographyP>
        </div>
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col px-2.5 sm:px-5 animate-page-in">
      {/* Banner Section */}
      {/* Desktop Banner Section 1050px */}
      <div className="w-full flex items-center justify-between gap-6 lg:gap-10 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-6 py-8 sm:px-8 tablet-xl:hidden">
        <div className="flex flex-col items-start gap-3">
          <TypographyH2 className="leading-relaxed">
            {tFav("bannerTitle")}
          </TypographyH2>
          <TypographyH4 className="leading-relaxed">
            {tFav("bannerSubtitle1")}
          </TypographyH4>
          <TypographyH4 className="leading-relaxed">
            {tFav("bannerSubtitle2")}
          </TypographyH4>
          <TypographyMuted className="leading-relaxed">
            {tFav("bannerMuted")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={favoriteBannerSvg}
            alt="favorites"
            height={250}
            width={350}
            className="h-auto max-w-[340px] shrink-0"
            priority
          />
        )}
      </div>

      {/* Tablet Banner Section 651px–1050px */}
      <div className="hidden tablet-xl:flex tablet-md:!hidden w-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-transparent to-muted/30 border border-border/50 px-5 py-5 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <TypographyH3 className="!leading-snug">
            {tFav("bannerTitle")}
          </TypographyH3>
          <TypographyMuted className="!leading-snug">
            {tFav("bannerSubtitle1")}
          </TypographyMuted>
          <TypographyMuted className="!leading-snug">
            {tFav("bannerSubtitle2")}
          </TypographyMuted>
        </div>
        {mounted && (
          <Image
            src={favoriteBannerSvg}
            alt="favorites"
            width={160}
            height={160}
            className="shrink-0 h-auto object-contain"
            priority
          />
        )}
      </div>

      {/* Mobile Banner Section ≤650px */}
      <div className="hidden tablet-md:flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.03] to-muted/40 border border-border/50 px-4 py-3 overflow-hidden">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <h2 className="font-bold text-sm leading-snug text-foreground">
            {tFav("bannerTitle")}
          </h2>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {tFav("bannerSubtitle1")}
          </p>
        </div>
        {mounted && (
          <Image
            src={favoriteBannerSvg}
            alt="favorites"
            width={88}
            height={88}
            className="flex-shrink-0 object-contain"
            priority
          />
        )}
      </div>

      {/* Favorite Card List Section */}
      <div className="mt-5 flex flex-col items-start gap-3 stagger-list">
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
              src={emptySvg}
              alt="empty"
              height={200}
              width={200}
              className="animate-float"
            />
            <TypographyP className="!m-0 text-sm font-medium text-muted-foreground">
              {tFav("emptyList")}
            </TypographyP>
          </div>
        )}
      </div>
    </div>
  );
}
