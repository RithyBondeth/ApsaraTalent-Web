"use client";

import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import FavoriteCompanyCard from "@/components/favorite/company-favorite-card";
import FavoriteEmployeeCard from "@/components/favorite/employee-favorite-card";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { emptySvg } from "@/utils/constants/asset.constant";
import { FavoriteLoadingSkeleton } from "@/components/favorite/skeleton";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { Bookmark, Building2, Users } from "lucide-react";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";

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
  const queryAllEmployeeFavorites =
    getAllEmployeeFavoritesStore.queryAllEmployeeFavorites;
  const queryAllCompanyFavorites =
    getAllCompanyFavoritesStore.queryAllCompanyFavorites;

  // Remove Employee and Company Favorites
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();

  // Count All Employee and Company Favorites
  const decrementEmpFavCount = useCountCurrentEmployeeFavoritesStore(
    (s) => s.decrementCount,
  );
  const decrementCmpFavCount = useCountCurrentCompanyFavoritesStore(
    (s) => s.decrementCount,
  );

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

  /* Always fetch the favorites list fresh on every mount so liked items are
    never stale (e.g. a card was liked in another tab / session).
    The badge count is maintained optimistically by the count stores and does
    NOT need a separate API re-fetch here — the navbar already fetches it on
    app load and increment/decrementCount keep it in sync for all user actions.
  */
  useEffect(() => {
    if (!currentUser) return;
    if (isEmployee && currentUser.employee?.id) {
      queryAllEmployeeFavorites(currentUser.employee.id);
    } else if (!isEmployee && currentUser.company?.id) {
      queryAllCompanyFavorites(currentUser.company.id);
    }
  }, [
    currentUser,
    isEmployee,
    queryAllEmployeeFavorites,
    queryAllCompanyFavorites,
  ]);

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
          decrementEmpFavCount();
          toast.success(t("removedFromFavorites", { name: companyName }));
          await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
            employeeID,
          );
        } catch (error) {
          const err =
            (error instanceof Error && error.message) ||
            employeeFavCompanyStore.empFavError ||
            t("failedToRemoveFavorite");
          toast.error(err);
        }
      });
    },
    [
      animateThenRemove,
      employeeFavCompanyStore,
      decrementEmpFavCount,
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
          decrementCmpFavCount();
          toast.success(t("removedFromFavorites", { name: employeeName }));
          await getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyID);
        } catch (error) {
          const err =
            (error instanceof Error && error.message) ||
            companyFavEmployeeStore.cmpFavError ||
            t("failedToRemoveFavorite");
          toast.error(err);
        }
      });
    },
    [
      animateThenRemove,
      companyFavEmployeeStore,
      decrementCmpFavCount,
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
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-center px-3 py-10 sm:px-4 lg:px-5">
        <PageState
          variant="error"
          title={apiError}
          compact
          action={{
            label: tFav("retry"),
            onClick: () => {
              if (isEmployee && currentUser?.employee?.id) {
                void queryAllEmployeeFavorites(currentUser.employee.id);
              } else if (currentUser?.company?.id) {
                void queryAllCompanyFavorites(currentUser.company.id);
              }
            },
          }}
        />
      </div>
    );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="favorite-editorial animate-page-in mx-auto flex w-full max-w-[1500px] flex-col items-start gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Banner Section */}
      <PageBanner
        eyebrow={tFav("savedFavorites")}
        title={tFav("bannerTitle")}
        subtitle={`${tFav("bannerSubtitle1")} ${tFav("bannerSubtitle2")}`}
        stats={[
          {
            icon: Bookmark,
            label: isEmployee ? tFav("companiesSaved") : tFav("talentSaved"),
            value: isEmployee
              ? (filteredEmployeeFavorites?.length ?? 0)
              : (filteredCompanyFavorites?.length ?? 0),
          },
        ]}
      />

      {/* Favorite Card List Section */}
      <section className="flex w-full flex-col gap-5">
        <div className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black tracking-[0.16em] text-muted-foreground">
              01
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-foreground sm:text-2xl">
                {tFav("savedFavorites")}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {isEmployee
                  ? `${filteredEmployeeFavorites?.length ?? 0} ${tFav("companiesSaved")}`
                  : `${filteredCompanyFavorites?.length ?? 0} ${tFav("talentSaved")}`}
              </p>
            </div>
          </div>
          <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            {isEmployee ? (
              <Building2 className="size-4" />
            ) : (
              <Users className="size-4" />
            )}
          </div>
        </div>

        <div className="stagger-list flex w-full flex-col items-start gap-3">
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
            <PageState
              variant="empty"
              title={tFav("emptyList")}
              image={emptySvg}
              compact
              className="my-6 sm:my-8"
              action={{
                label: tFav("explore"),
                href: isEmployee ? "/search/company" : "/search/employee",
              }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
