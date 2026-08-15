"use client";

import EmployeeCardSkeleton from "@/components/employee/skeleton";
import ImagePopup from "@/components/utils/data-display/image-popup";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useGetEmployeeRecommendationsStore } from "@/stores/apis/recommendation/get-employee-recommendations.store";
import { useGetCompanyRecommendationsStore } from "@/stores/apis/recommendation/get-company-recommendations.store";
import { useModerationStore } from "@/stores/apis/moderation/moderation.store";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { Building2, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { emptySvg } from "@/utils/constants/asset.constant";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  FEED_PAGE_SIZE,
  LIKE_DEBOUNCE_MS,
} from "@/utils/constants/config.constant";
import CompanyCardSkeleton from "@/components/company/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FeedBannerSkeleton,
  FeedDividerSkeleton,
  FeedRecommendationsSkeleton,
} from "@/components/feed/skeleton";
import { MemoCompanyFeedCard } from "@/components/feed/memo-company-feed-card";
import { MemoEmployeeFeedCard } from "@/components/feed/memo-employee-feed-card";
import { useFeedActionEffect } from "@/components/utils/effects/feed-action-effect";
import { PageState } from "@/components/utils/feedback/page-state";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { FadeIn } from "@/components/utils/layout/fade-in";
import { OnboardingFlow } from "@/components/utils/onboarding/onboarding-flow";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";

interface Props {
  initialIsEmployee: boolean;
}

// Cells of one ruled sheet rather than a gapped tray of cards: the 1px gap
// over a border-coloured bed draws a single hairline between neighbours, so
// adjacent cards share an edge instead of each drawing its own box and
// leaving a channel of page between them.
const FEED_CARD_GRID_CLASS =
  "pixel-ruled w-full grid-cols-3 items-stretch border-x-0 laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 stagger-list [&>*]:min-w-0 [&>*]:h-full";

export default function FeedPageClient({ initialIsEmployee }: Props) {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("toast");
  const tFeed = useTranslations("feed");

  /* -------------------------------- All States ------------------------------ */
  // Feed Action Effect
  const { trigger: triggerEffect, effectPortal } = useFeedActionEffect();
  const [mounted, setMounted] = useState<boolean>(false);

  // Skeleton
  const skeletonIsEmployee = initialIsEmployee;
  const [recsHasFetched, setRecsHasFetched] = useState<boolean>(false);

  // Infinite scroll
  const [visibleCount, setVisibleCount] = useState<number>(FEED_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Liked helper
  const [likingId, setLikingId] = useState<string | null>(null);

  // Saving helper
  const [savingId, setSavingId] = useState<string | null>(null);

  // Pop up Dialog
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(
    null,
  );

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const currentUser = useGetCurrentUserStore((s) => s.user);

  // Moderation — profile ids hidden in BOTH directions (people I blocked AND
  // people who blocked me), so blocked users vanish from the feed for everyone.
  const hiddenProfileIds = useModerationStore((s) => s.hiddenProfileIds);
  const hiddenLoaded = useModerationStore((s) => s.hiddenLoaded);
  const getHiddenProfileIds = useModerationStore((s) => s.getHiddenProfileIds);

  // All Company Data APIs
  const companyData = useGetAllCompanyStore((s) => s.companyData);
  const companyLoading = useGetAllCompanyStore((s) => s.loading);
  const companyError = useGetAllCompanyStore((s) => s.error);
  const queryCompany = useGetAllCompanyStore((s) => s.queryCompany);

  // All Employee Data APIs
  const employeesData = useGetAllEmployeeStore((s) => s.employeesData);
  const employeeLoading = useGetAllEmployeeStore((s) => s.loading);
  const employeeError = useGetAllEmployeeStore((s) => s.error);
  const queryEmployee = useGetAllEmployeeStore((s) => s.queryEmployee);

  // All Employee Liked APIs
  const employeeLike = useEmployeeLikeStore((s) => s.employeeLike);
  const employeeLikeLoading = useEmployeeLikeStore((s) => s.loading);
  const currentEmployeeLiked = useGetCurrentEmployeeLikedStore(
    (s) => s.currentEmployeeLiked,
  );
  const currentEmployeeLikedLoading = useGetCurrentEmployeeLikedStore(
    (s) => s.loading,
  );
  const queryCurrentEmployeeLiked = useGetCurrentEmployeeLikedStore(
    (s) => s.queryCurrentEmployeeLiked,
  );
  const optimisticAddEmployeeLiked = useGetCurrentEmployeeLikedStore(
    (s) => s.optimisticAddLiked,
  );

  // All Company Liked APIs
  const companyLike = useCompanyLikeStore((s) => s.companyLike);
  const companyLikeLoading = useCompanyLikeStore((s) => s.loading);
  const currentCompanyLiked = useGetCurrentCompanyLikedStore(
    (s) => s.currentCompanyLiked,
  );
  const currentCompanyLikedLoading = useGetCurrentCompanyLikedStore(
    (s) => s.loading,
  );
  const queryCurrentCompanyLiked = useGetCurrentCompanyLikedStore(
    (s) => s.queryCurrentCompanyLiked,
  );
  const optimisticAddCompanyLiked = useGetCurrentCompanyLikedStore(
    (s) => s.optimisticAddLiked,
  );

  // All Employee Favorite APIs
  const {
    addCompanyToFavorite,
    favoriteCompanyIds,
    empFavError,
    optimisticRemove: optimisticRemoveEmpFav,
  } = useEmployeeFavCompanyStore();
  const isEmpFavorite = useCallback(
    (id: string) => favoriteCompanyIds.has(id),
    [favoriteCompanyIds],
  );
  const { queryAllEmployeeFavorites } = useGetAllEmployeeFavoritesStore();

  // All Company Favorite APIs
  const {
    addEmployeeToFavorite,
    favoriteEmployeeIds,
    cmpFavError,
    optimisticRemove: optimisticRemoveCmpFav,
  } = useCompanyFavEmployeeStore();
  const isCmpFavorite = useCallback(
    (id: string) => favoriteEmployeeIds.has(id),
    [favoriteEmployeeIds],
  );
  const { queryAllCompanyFavorites } = useGetAllCompanyFavoritesStore();

  // Count All Current Employee/Company Favorite APIs
  const incrementEmpFavCount = useCountCurrentEmployeeFavoritesStore(
    (s) => s.incrementCount,
  );
  const decrementEmpFavCount = useCountCurrentEmployeeFavoritesStore(
    (s) => s.decrementCount,
  );
  const incrementCmpFavCount = useCountCurrentCompanyFavoritesStore(
    (s) => s.incrementCount,
  );
  const decrementCmpFavCount = useCountCurrentCompanyFavoritesStore(
    (s) => s.decrementCount,
  );

  // Note: matching count updates are handled exclusively via the socket
  // "newNotification" type=match event (incrementCount) so no direct API
  // re-fetch is needed here — doing both would double-increment the badge.

  // Recommendations APIs
  const employeeRecommendations = useGetEmployeeRecommendationsStore(
    (s) => s.recommendations,
  );
  const employeeRecommendationsLoading = useGetEmployeeRecommendationsStore(
    (s) => s.loading,
  );
  const employeeRecommendationsError = useGetEmployeeRecommendationsStore(
    (s) => s.error,
  );
  const queryEmployeeRecommendations = useGetEmployeeRecommendationsStore(
    (s) => s.queryEmployeeRecommendations,
  );
  const companyRecommendations = useGetCompanyRecommendationsStore(
    (s) => s.recommendations,
  );
  const companyRecommendationsLoading = useGetCompanyRecommendationsStore(
    (s) => s.loading,
  );
  const companyRecommendationsError = useGetCompanyRecommendationsStore(
    (s) => s.error,
  );
  const queryCompanyRecommendations = useGetCompanyRecommendationsStore(
    (s) => s.queryCompanyRecommendations,
  );

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => setMounted(true), []);

  // Fetch All Current Employee or Company Liked - User Specific Data (Reset When User Change)
  const { isEmployee } = useFetchOnce({
    cacheKey: "feed-page",
    onEmployeeFetch: queryCurrentEmployeeLiked,
    onCompanyFetch: queryCurrentCompanyLiked,
  });

  // Fetch Recommendations
  const recsFetchedForRef = useRef<string | null>(null);
  useEffect(() => {
    if (!currentUser) return;

    const id = isEmployee ? currentUser.employee?.id : currentUser.company?.id;
    if (!id) return;

    if (recsFetchedForRef.current === id) return;
    const existingRecommendations = isEmployee
      ? employeeRecommendations
      : companyRecommendations;
    if (existingRecommendations !== null) {
      recsFetchedForRef.current = id;
      setRecsHasFetched(true);
      return;
    }
    recsFetchedForRef.current = id;
    setRecsHasFetched(false);

    const fetchPromise = isEmployee
      ? queryEmployeeRecommendations(id)
      : queryCompanyRecommendations(id);

    fetchPromise.finally(() => setRecsHasFetched(true));
  }, [
    currentUser,
    isEmployee,
    employeeRecommendations,
    companyRecommendations,
    queryEmployeeRecommendations,
    queryCompanyRecommendations,
  ]);

  // Stable refs for store methods
  const queryCompanyRef = useRef(queryCompany);
  const queryEmployeeRef = useRef(queryEmployee);
  useEffect(() => {
    queryCompanyRef.current = queryCompany;
    queryEmployeeRef.current = queryEmployee;
  });

  // Fetch All Companies or Employees - Global Data
  useEffect(() => {
    if (!currentUser) return;

    if (isEmployee) {
      if (!companyData && !companyLoading && !companyError) {
        void queryCompanyRef.current();
      }
    } else {
      if (!employeesData && !employeeLoading && !employeeError) {
        void queryEmployeeRef.current();
      }
    }
  }, [
    isEmployee,
    currentUser,
    companyData,
    companyLoading,
    companyError,
    employeesData,
    employeeLoading,
    employeeError,
  ]);

  // Fetch the hidden-id set (both block directions) so blocked profiles are
  // hidden from the feed regardless of who initiated the block.
  useEffect(() => {
    if (!hiddenLoaded) getHiddenProfileIds();
  }, [hiddenLoaded, getHiddenProfileIds]);

  const blockedProfileIds = useMemo(
    () => new Set<string>(hiddenProfileIds),
    [hiddenProfileIds],
  );

  const allUsers: ICompany[] | IEmployee[] = useMemo(() => {
    if (!currentUser) return [];

    if (isEmployee) {
      const users = companyData ?? [];
      return users.filter(
        (company) =>
          company.id &&
          !blockedProfileIds.has(company.id) &&
          !(currentEmployeeLiked ?? []).some(
            (liked) => liked.id === company.id,
          ),
      );
    } else {
      const users = employeesData ?? [];
      return users.filter(
        (employee) =>
          employee.id &&
          !blockedProfileIds.has(employee.id) &&
          !(currentCompanyLiked ?? []).some(
            (liked) => liked.id === employee.id,
          ),
      );
    }
  }, [
    currentUser,
    isEmployee,
    companyData,
    employeesData,
    currentEmployeeLiked,
    currentCompanyLiked,
    blockedProfileIds,
  ]);

  // Filter recommendations against the liked + blocked lists so cards vanish
  // Immediately after a like and never show blocked users.
  const filteredEmployeeRecommendations = useMemo(() => {
    if (!employeeRecommendations) return null;
    return employeeRecommendations.filter(
      (company) =>
        !blockedProfileIds.has(company.id) &&
        !(currentEmployeeLiked ?? []).some((liked) => liked.id === company.id),
    );
  }, [employeeRecommendations, currentEmployeeLiked, blockedProfileIds]);

  const filteredCompanyRecommendations = useMemo(() => {
    if (!companyRecommendations) return null;
    return companyRecommendations.filter(
      (employee) =>
        !blockedProfileIds.has(employee.id) &&
        !(currentCompanyLiked ?? []).some((liked) => liked.id === employee.id),
    );
  }, [companyRecommendations, currentCompanyLiked, blockedProfileIds]);

  // Reset visible count when the feed data source changes
  useEffect(() => {
    setVisibleCount(FEED_PAGE_SIZE);
  }, [isEmployee]);

  // Infinite scroll — reveal more cards when sentinel enters the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + FEED_PAGE_SIZE);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Profile Pop up Effect
  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), LIKE_DEBOUNCE_MS);
    }
  }, [openProfilePopup]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Employee Like Company ─────────────────────────────────────────
  const handleEmployeeLikeCompany = useCallback(
    async (employeeID: string, companyID: string) => {
      if (!employeeID || !companyID) return;
      setLikingId(companyID);

      /* 
        Optimistic update — remove card instantly before API responds
        Check both the main feed and the recommendations list so recommendation-only
        cards also vanish immediately without waiting for a server round-trip.
      */
      triggerEffect("like");
      const company =
        companyData?.find((c) => c.id === companyID) ??
        employeeRecommendations?.find((c) => c.id === companyID);
      if (company) optimisticAddEmployeeLiked(company);

      /* 
        Backend auto-removes favorite on like — snapshot BEFORE removing from Set,
        then decrement the badge count immediately (avoids a re-fetch race condition
        where a stale in-flight count request resolves after and overwrites with the
        old value).
      */
      const wasFavorited = isEmpFavorite(companyID);
      optimisticRemoveEmpFav(companyID);
      if (wasFavorited) decrementEmpFavCount();

      try {
        await employeeLike(employeeID, companyID);
        const liked = useEmployeeLikeStore.getState().data;
        if (liked) {
          if (liked.isMatched) {
            toast.success(t("itsAMatch"), {
              description: t("youLikedEachOther", {
                name: company?.name ?? "",
              }),
            });
            // Badge increment handled by socket "newNotification" type=match
            // for both parties — no local countCurrentEmpMatching call needed.
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          } else {
            toast.success(t("youLiked", { name: company?.name ?? "" }), {
              description: tFeed("likedSuccessDescription"),
            });
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
        }
        // Sync with server to confirm (replaces optimistic state)
        await queryCurrentEmployeeLiked(employeeID);
      } catch {
        toast.error(
          useEmployeeLikeStore.getState().error || t("failedToLikeCompany"),
        );
      } finally {
        setLikingId(null);
      }
    },
    [
      employeeLike,
      decrementEmpFavCount,
      queryCurrentEmployeeLiked,
      optimisticAddEmployeeLiked,
      optimisticRemoveEmpFav,
      isEmpFavorite,
      companyData,
      employeeRecommendations,
      router,
      t,
      tFeed,
      triggerEffect,
    ],
  );

  // ── Handle Company Like Employee ─────────────────────────────────────────
  const handleCompanyLikeEmployee = useCallback(
    async (companyID: string, employeeID: string) => {
      if (!companyID || !employeeID) return;
      setLikingId(employeeID);

      /* 
        Optimistic update — remove card instantly before API responds
        Check both the main feed and the recommendations list so recommendation-only
        cards also vanish immediately without waiting for a server round-trip.
      */
      triggerEffect("like");
      const employee =
        employeesData?.find((e) => e.id === employeeID) ??
        companyRecommendations?.find((e) => e.id === employeeID);
      if (employee) optimisticAddCompanyLiked(employee);

      // Backend auto-removes favorite on like — snapshot BEFORE removing from Set,
      // then decrement the badge count immediately (avoids a re-fetch race condition).
      const wasFavorited = isCmpFavorite(employeeID);
      optimisticRemoveCmpFav(employeeID);
      if (wasFavorited) decrementCmpFavCount();

      try {
        await companyLike(companyID, employeeID);
        const liked = useCompanyLikeStore.getState().data;
        if (liked) {
          if (liked.isMatched) {
            toast.success(t("itsAMatch"), {
              description: t("youLikedEachOther", {
                name: employee?.username ?? "",
              }),
            });
            // Badge increment handled by socket "newNotification" type=match
            // for both parties — no local countCurrentCmpMatching call needed.
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          } else {
            toast.success(t("youLiked", { name: employee?.username ?? "" }), {
              description: tFeed("likedSuccessDescription", {
                name: employee?.username ?? "",
              }),
            });
            setTimeout(() => router.push("/feed"), DEFAULT_REDIRECT_DELAY_MS);
          }
          // Sync with server to confirm (replaces optimistic state)
          await queryCurrentCompanyLiked(companyID);
        }
      } catch {
        toast.error(
          useCompanyLikeStore.getState().error || t("failedToLikeCompany"),
        );
      } finally {
        setLikingId(null);
      }
    },
    [
      companyLike,
      decrementCmpFavCount,
      queryCurrentCompanyLiked,
      optimisticAddCompanyLiked,
      optimisticRemoveCmpFav,
      isCmpFavorite,
      employeesData,
      companyRecommendations,
      router,
      t,
      tFeed,
      triggerEffect,
    ],
  );

  // ── Handle Employee Favorite Company ─────────────────────────────────────────
  const handleEmployeeFavoriteCompany = useCallback(
    async (employeeID: string, companyID: string, companyName: string) => {
      if (!employeeID || !companyID) return;
      setSavingId(companyID);
      triggerEffect("save");
      try {
        await addCompanyToFavorite(employeeID, companyID);
        // Increment badge immediately — avoids a re-fetch race where a stale
        // in-flight count request resolves after a subsequent like and overwrites.
        incrementEmpFavCount();
        toast.success(t("addedToFavorites", { name: companyName }), {
          description: t("addedToFavoritesDescription"),
        });
        await queryAllEmployeeFavorites(employeeID);
      } catch {
        toast.error(empFavError || t("failedToSaveFavorite"));
      } finally {
        setSavingId(null);
      }
    },
    [
      addCompanyToFavorite,
      incrementEmpFavCount,
      queryAllEmployeeFavorites,
      empFavError,
      t,
      triggerEffect,
    ],
  );

  // ── Handle Company Favorite Employee ─────────────────────────────────────────
  const handleCompanyFavoriteEmployee = useCallback(
    async (companyID: string, employeeID: string, employeeName: string) => {
      if (!companyID || !employeeID) return;
      setSavingId(employeeID);
      triggerEffect("save");
      try {
        await addEmployeeToFavorite(companyID, employeeID);
        // Increment badge immediately — same reason as employee side.
        incrementCmpFavCount();
        toast.success(t("addedToFavorites", { name: employeeName }), {
          description: t("addedToFavoritesDescription"),
        });
        await queryAllCompanyFavorites(companyID);
      } catch {
        toast.error(cmpFavError || t("failedToSaveFavorite"));
      } finally {
        setSavingId(null);
      }
    },
    [
      addEmployeeToFavorite,
      incrementCmpFavCount,
      queryAllCompanyFavorites,
      cmpFavError,
      t,
      triggerEffect,
    ],
  );

  // ── Handle Profile Pop up Dialog ─────────────────────────────────────────
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  // ── View Employee & Company Detail Page ──────────────────────────────────
  const handleEmployeeViewCompany = useCallback(
    (id: string) => router.push(`/feed/company/${id}`),
    [router],
  );
  const handleCompanyViewEmployee = useCallback(
    (id: string) => router.push(`/feed/employee/${id}`),
    [router],
  );

  /* ------------------------------ Loading State ------------------------------ */
  const isLoading =
    !mounted ||
    !currentUser ||
    !recsHasFetched ||
    (isEmployee && (companyLoading || currentEmployeeLikedLoading)) ||
    (!isEmployee && (employeeLoading || currentCompanyLikedLoading));
  const feedError = isEmployee ? companyError : employeeError;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="feed-scope animate-page-in flex w-full flex-col items-start gap-7 sm:gap-9">
      {effectPortal}
      {/* First-Time User Onboarding Flow Section */}
      <OnboardingFlow />
      {/* Feed Banner Section */}
      {isLoading ? (
        <FeedBannerSkeleton />
      ) : (
        <FadeIn className="w-full">
          {/* Feed Banner Content Section */}
          <PageBanner
            eyebrow={isEmployee ? tFeed("allCompanies") : tFeed("allTalent")}
            title={
              isEmployee
                ? tFeed("employeeBannerTitle")
                : tFeed("companyBannerTitle")
            }
            subtitle={`${
              isEmployee
                ? tFeed("employeeBannerSubtitle1")
                : tFeed("companyBannerSubtitle1")
            } ${
              isEmployee
                ? tFeed("employeeBannerSubtitle2")
                : tFeed("companyBannerSubtitle2")
            }`}
            stats={[
              {
                icon: isEmployee ? Building2 : Users,
                label: isEmployee ? tFeed("allCompanies") : tFeed("allTalent"),
                value: allUsers.length,
              },
              {
                icon: Sparkles,
                label: tFeed("recommendedForYou"),
                value:
                  (isEmployee
                    ? filteredEmployeeRecommendations
                    : filteredCompanyRecommendations
                  )?.length ?? 0,
              },
            ]}
          />
        </FadeIn>
      )}

      {/* Recommended for You Section */}
      {isLoading ? (
        <FeedRecommendationsSkeleton isEmployee={skeletonIsEmployee} />
      ) : (
        (() => {
          const recs = isEmployee
            ? filteredEmployeeRecommendations
            : filteredCompanyRecommendations;
          const recsLoading = isEmployee
            ? employeeRecommendationsLoading
            : companyRecommendationsLoading;
          const recsError = isEmployee
            ? employeeRecommendationsError
            : companyRecommendationsError;

          if (recsLoading) {
            return (
              <div className="flex w-full flex-col gap-5 border-y border-border py-6">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
                      01
                    </span>
                    <h2 className="pixel-display text-xl text-foreground sm:text-2xl">
                      {tFeed("recommendedForYou")}
                    </h2>
                  </div>
                  <Sparkles className="size-5 text-foreground" />
                </div>
                <div className={FEED_CARD_GRID_CLASS}>
                  {Array.from({ length: 3 }).map((_, i) =>
                    isEmployee ? (
                      <div key={i} className="flex h-full flex-col">
                        <div className="mb-1.5 flex items-center gap-1 px-1">
                          <Skeleton className="size-3 rounded-none" />
                          <Skeleton className="h-2.5 w-16 rounded-none" />
                        </div>
                        <CompanyCardSkeleton />
                      </div>
                    ) : (
                      <div key={i} className="flex h-full flex-col">
                        <div className="mb-1.5 flex items-center gap-1 px-1">
                          <Skeleton className="size-3 rounded-none" />
                          <Skeleton className="h-2.5 w-16 rounded-none" />
                        </div>
                        <EmployeeCardSkeleton />
                      </div>
                    ),
                  )}
                </div>
              </div>
            );
          }

          // Only show the retry button after this instance's own fetch has settled.
          // Guarding with recsHasFetched prevents flashing stale error state that
          // may still be in the store from a previous session's failed fetch.
          if (recsHasFetched && recsError && (!recs || recs.length === 0)) {
            const retryId = isEmployee
              ? currentUser?.employee?.id
              : currentUser?.company?.id;
            const retryFn = isEmployee
              ? queryEmployeeRecommendations
              : queryCompanyRecommendations;

            return (
              <div className="flex w-full items-center gap-3 border-y border-border py-5">
                <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
                  01
                </span>
                <TypographyMuted>{tFeed("recommendedForYou")}</TypographyMuted>
                {retryId && (
                  <button
                    onClick={() => {
                      recsFetchedForRef.current = null;
                      setRecsHasFetched(false);
                      retryFn(retryId).finally(() => setRecsHasFetched(true));
                    }}
                    className="border-b border-foreground text-xs font-medium text-foreground transition-opacity hover:opacity-60"
                  >
                    {tFeed("retry")}
                  </button>
                )}
              </div>
            );
          }

          if (!recs || recs.length === 0) return null;

          return (
            <FadeIn className="flex w-full flex-col gap-5 border-y border-border py-6">
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
                    01
                  </span>
                  <h2 className="pixel-display text-xl text-foreground sm:text-2xl">
                    {tFeed("recommendedForYou")}
                  </h2>
                </div>
                <Sparkles className="size-5 text-foreground" />
              </div>
              <div className={FEED_CARD_GRID_CLASS}>
                {isEmployee
                  ? (recs as ICompany[]).map((company) => (
                      <MemoCompanyFeedCard
                        key={company.id}
                        company={company}
                        employeeId={currentUser?.employee?.id ?? ""}
                        isLiking={
                          company.id === likingId && employeeLikeLoading
                        }
                        isSaving={company.id === savingId}
                        isFavorite={isEmpFavorite(company.id)}
                        isRecommended
                        onView={handleEmployeeViewCompany}
                        onLike={handleEmployeeLikeCompany}
                        onSave={handleEmployeeFavoriteCompany}
                        onProfileImageClick={handleClickProfilePopup}
                        onSetProfileImage={setCurrentProfileImage}
                      />
                    ))
                  : (recs as IEmployee[]).map((employee) => (
                      <MemoEmployeeFeedCard
                        key={employee.id}
                        employee={employee}
                        companyId={currentUser?.company?.id ?? ""}
                        isLiking={
                          employee.id === likingId && companyLikeLoading
                        }
                        isSaving={employee.id === savingId}
                        isFavorite={isCmpFavorite(employee.id)}
                        isRecommended
                        onView={handleCompanyViewEmployee}
                        onLike={handleCompanyLikeEmployee}
                        onSave={handleCompanyFavoriteEmployee}
                        onProfileImageClick={handleClickProfilePopup}
                        onSetProfileImage={setCurrentProfileImage}
                      />
                    ))}
              </div>
            </FadeIn>
          );
        })()
      )}

      {/* Divider Section: All Companies / All Talent */}
      {isLoading ? (
        <FeedDividerSkeleton />
      ) : (
        <FadeIn className="flex w-full items-end justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium tracking-[0.16em] text-muted-foreground">
              02
            </span>
            <h2 className="pixel-display text-xl text-foreground sm:text-2xl">
              {isEmployee ? tFeed("allCompanies") : tFeed("allTalent")}
            </h2>
          </div>
          <div className="grid size-9 shrink-0 place-items-center bg-primary text-primary-foreground">
            {isEmployee ? (
              <Building2 className="size-4" />
            ) : (
              <Users className="size-4" />
            )}
          </div>
        </FadeIn>
      )}

      {/* Feed Card Section */}
      <div
        key={isEmployee ? "companies" : "employees"}
        className={FEED_CARD_GRID_CLASS}
      >
        {/* Loading Skeleton Section */}
        {isLoading
          ? Array.from({ length: FEED_PAGE_SIZE }).map((_, index) =>
              skeletonIsEmployee ? (
                <div
                  key={`company-skeleton-${index}`}
                  className="flex h-full flex-col"
                >
                  <CompanyCardSkeleton />
                </div>
              ) : (
                <div
                  key={`employee-skeleton-${index}`}
                  className="flex h-full flex-col"
                >
                  <EmployeeCardSkeleton />
                </div>
              ),
            )
          : allUsers
              .slice(0, visibleCount)
              .map((user) =>
                isEmployee ? (
                  <MemoCompanyFeedCard
                    key={user.id}
                    company={user as ICompany}
                    employeeId={currentUser?.employee?.id ?? ""}
                    isLiking={user.id === likingId && employeeLikeLoading}
                    isSaving={user.id === savingId}
                    isFavorite={isEmpFavorite(user.id)}
                    onView={handleEmployeeViewCompany}
                    onLike={handleEmployeeLikeCompany}
                    onSave={handleEmployeeFavoriteCompany}
                    onProfileImageClick={handleClickProfilePopup}
                    onSetProfileImage={setCurrentProfileImage}
                  />
                ) : (
                  <MemoEmployeeFeedCard
                    key={user.id}
                    employee={user as IEmployee}
                    companyId={currentUser?.company?.id ?? ""}
                    isLiking={user.id === likingId && companyLikeLoading}
                    isSaving={user.id === savingId}
                    isFavorite={isCmpFavorite(user.id)}
                    onView={handleCompanyViewEmployee}
                    onLike={handleCompanyLikeEmployee}
                    onSave={handleCompanyFavoriteEmployee}
                    onProfileImageClick={handleClickProfilePopup}
                    onSetProfileImage={setCurrentProfileImage}
                  />
                ),
              )}
      </div>

      {/* Error State Section */}
      {!isLoading && feedError && (
        <PageState
          variant="error"
          title={feedError}
          description={tFeed("loadErrorDescription")}
          compact
          className="my-6 sm:my-8"
          action={{
            label: tFeed("retry"),
            onClick: isEmployee ? queryCompany : queryEmployee,
          }}
        />
      )}

      {/* Empty List Section */}
      {!isLoading && !feedError && allUsers.length === 0 && (
        <PageState
          variant="empty"
          title={
            isEmployee ? tFeed("companyListEmpty") : tFeed("employeeListEmpty")
          }
          image={emptySvg}
          compact
          className="my-6 sm:my-8"
          action={{
            label: isEmployee
              ? tFeed("exploreAllCompanies")
              : tFeed("exploreAllTalent"),
            href: isEmployee ? "/search/company" : "/search/employee",
          }}
        />
      )}

      {/* Infinite Scroll Sentinel Section: Triggers revealing the next batch of already-loaded cards */}
      {!isLoading && visibleCount < allUsers.length && (
        <div ref={sentinelRef} className="h-1 w-full" />
      )}

      {/* End of Results Section */}
      {!isLoading && allUsers.length > 0 && visibleCount >= allUsers.length && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <div className="flex w-full max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="shrink-0 text-xs font-medium text-muted-foreground/60">
              {tFeed("endOfResults")}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>
        </div>
      )}

      {/* Image Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={currentProfileImage!}
      />
    </div>
  );
}
