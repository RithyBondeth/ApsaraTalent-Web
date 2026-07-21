"use client";

import ImagePopup from "@/components/utils/data-display/image-popup";
import { EditorialIllustration } from "@/components/utils/data-display/editorial-illustration";
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
import {
  ArrowRight,
  Building2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_REDIRECT_DELAY_MS,
  FEED_PAGE_SIZE,
  LIKE_DEBOUNCE_MS,
} from "@/utils/constants/config.constant";
import FeedPageLoadingSkeleton from "@/components/feed/skeleton";
import { MemoCompanyFeedCard } from "@/components/feed/memo-company-feed-card";
import { MemoEmployeeFeedCard } from "@/components/feed/memo-employee-feed-card";
import { useFeedActionEffect } from "@/components/utils/effects/feed-action-effect";
import { FadeIn } from "@/components/utils/layout/fade-in";
import { OnboardingFlow } from "@/components/utils/onboarding/onboarding-flow";
import Link from "next/link";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { Button } from "@/components/ui/button";

interface Props {
  initialIsEmployee: boolean;
}

const fetchInitiated = {
  companies: false,
  employees: false,
};

const FEATURED_GRID_CLASS =
  "stagger-list grid w-full grid-flow-col auto-cols-[86%] items-stretch gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:auto-cols-[48%] lg:grid-flow-row lg:auto-cols-auto lg:grid-cols-3 lg:overflow-visible [&>*]:h-full [&>*]:min-w-0 [&>*]:snap-start";

const DISCOVERY_GRID_CLASS =
  "stagger-list grid w-full grid-cols-1 items-stretch gap-4 lg:grid-cols-2 [&>*]:h-full [&>*]:min-w-0";

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

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

  // Discovery controls
  const [visibleCount, setVisibleCount] = useState<number>(FEED_PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"recommended" | "az">("recommended");

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
  const queryCompany = useGetAllCompanyStore((s) => s.queryCompany);

  // All Employee Data APIs
  const employeesData = useGetAllEmployeeStore((s) => s.employeesData);
  const employeeLoading = useGetAllEmployeeStore((s) => s.loading);
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
  const employeeRecommendationsError = useGetEmployeeRecommendationsStore(
    (s) => s.error,
  );
  const queryEmployeeRecommendations = useGetEmployeeRecommendationsStore(
    (s) => s.queryEmployeeRecommendations,
  );
  const companyRecommendations = useGetCompanyRecommendationsStore(
    (s) => s.recommendations,
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
    recsFetchedForRef.current = id;
    setRecsHasFetched(false);

    const fetchPromise = isEmployee
      ? queryEmployeeRecommendations(id)
      : queryCompanyRecommendations(id);

    fetchPromise.finally(() => setRecsHasFetched(true));
  }, [
    currentUser,
    isEmployee,
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
      if (!fetchInitiated.companies || !companyData) {
        fetchInitiated.companies = true;
        queryCompanyRef.current();
      }
    } else {
      if (!fetchInitiated.employees || !employeesData) {
        fetchInitiated.employees = true;
        queryEmployeeRef.current();
      }
    }
  }, [isEmployee, currentUser, companyData, employeesData]);

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

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

  const featuredCompanies = useMemo(
    () =>
      isEmployee ? (filteredEmployeeRecommendations ?? []).slice(0, 3) : [],
    [isEmployee, filteredEmployeeRecommendations],
  );

  const featuredEmployees = useMemo(
    () =>
      !isEmployee ? (filteredCompanyRecommendations ?? []).slice(0, 3) : [],
    [isEmployee, filteredCompanyRecommendations],
  );

  const companyDiscovery = useMemo(() => {
    if (!isEmployee) return [];
    const recommendations = filteredEmployeeRecommendations ?? [];
    const combined = normalizedSearch
      ? [...recommendations, ...(allUsers as ICompany[])]
      : [...recommendations.slice(3), ...(allUsers as ICompany[])];
    const filtered = uniqueById(combined).filter((company) => {
      if (!normalizedSearch) return true;
      const searchable = [
        company.name,
        company.industry,
        company.location,
        ...company.openPositions.map((position) => position.title),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return searchable.includes(normalizedSearch);
    });
    return sortMode === "az"
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      : filtered;
  }, [
    isEmployee,
    filteredEmployeeRecommendations,
    allUsers,
    normalizedSearch,
    sortMode,
  ]);

  const employeeDiscovery = useMemo(() => {
    if (isEmployee) return [];
    const recommendations = filteredCompanyRecommendations ?? [];
    const combined = normalizedSearch
      ? [...recommendations, ...(allUsers as IEmployee[])]
      : [...recommendations.slice(3), ...(allUsers as IEmployee[])];
    const filtered = uniqueById(combined).filter((employee) => {
      if (!normalizedSearch) return true;
      const searchable = [
        employee.username,
        employee.job,
        employee.location,
        ...employee.skills.map((skill) => skill.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      return searchable.includes(normalizedSearch);
    });
    return sortMode === "az"
      ? [...filtered].sort((a, b) =>
          (a.username ?? "").localeCompare(b.username ?? ""),
        )
      : filtered;
  }, [
    isEmployee,
    filteredCompanyRecommendations,
    allUsers,
    normalizedSearch,
    sortMode,
  ]);

  const discoveryCount = isEmployee
    ? companyDiscovery.length
    : employeeDiscovery.length;

  // Reset the explicit pagination whenever the discovery view changes.
  useEffect(() => {
    setVisibleCount(FEED_PAGE_SIZE);
  }, [isEmployee, normalizedSearch, sortMode]);

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

  /* -------------------------------- Render UI -------------------------------- */
  const recommendationsError = isEmployee
    ? employeeRecommendationsError
    : companyRecommendationsError;
  const searchHref = isEmployee ? "/search/employee" : "/search/company";
  const visibleCompanies = companyDiscovery.slice(0, visibleCount);
  const visibleEmployees = employeeDiscovery.slice(0, visibleCount);
  const hasSearch = normalizedSearch.length > 0;
  const retryId = isEmployee
    ? currentUser?.employee?.id
    : currentUser?.company?.id;
  const retryRecommendations = isEmployee
    ? queryEmployeeRecommendations
    : queryCompanyRecommendations;
  const allCompaniesForMetrics = isEmployee
    ? uniqueById([
        ...(filteredEmployeeRecommendations ?? []),
        ...(allUsers as ICompany[]),
      ])
    : [];
  const allEmployeesForMetrics = !isEmployee
    ? uniqueById([
        ...(filteredCompanyRecommendations ?? []),
        ...(allUsers as IEmployee[]),
      ])
    : [];
  const primaryMetric = isEmployee
    ? allCompaniesForMetrics.length
    : allEmployeesForMetrics.length;
  const secondaryMetric = isEmployee
    ? allCompaniesForMetrics.reduce(
        (total, company) => total + company.openPositions.length,
        0,
      )
    : featuredEmployees.length;

  return (
    <div className="flex w-full flex-col items-start gap-7 animate-page-in">
      {effectPortal}
      <OnboardingFlow />

      {isLoading ? (
        <FeedPageLoadingSkeleton isEmployee={skeletonIsEmployee} />
      ) : (
        <>
          {/* Product-First Discovery Header Section */}
          <FadeIn className="w-full">
            <section className="feed-editorial-header relative w-full overflow-hidden border-b border-border/80 pb-7 pt-1 sm:pb-8">
              <span
                className="pointer-events-none absolute -right-10 -top-16 size-40 rounded-full border border-brand/10"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute right-9 top-3 size-2 rounded-full bg-brand/35"
                aria-hidden="true"
              />
              <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                    <Sparkles className="size-3" />
                    {isEmployee
                      ? tFeed("employeeHeroEyebrow")
                      : tFeed("companyHeroEyebrow")}
                  </span>
                  <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-[1.12] tracking-[-0.035em] text-foreground sm:text-4xl">
                    {isEmployee
                      ? tFeed("employeeHeroTitle")
                      : tFeed("companyHeroTitle")}
                  </h1>
                  <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    {isEmployee
                      ? tFeed("employeeHeroDescription")
                      : tFeed("companyHeroDescription")}
                  </p>

                  <div className="mt-5 flex max-w-2xl flex-col gap-2 sm:flex-row">
                    <label className="relative flex-1">
                      <span className="sr-only">
                        {isEmployee
                          ? tFeed("searchCompaniesPlaceholder")
                          : tFeed("searchTalentPlaceholder")}
                      </span>
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={
                          isEmployee
                            ? tFeed("searchCompaniesPlaceholder")
                            : tFeed("searchTalentPlaceholder")
                        }
                        className="h-12 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-sm shadow-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/75 focus:border-brand/60 focus:ring-4 focus:ring-brand/10"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          aria-label={tFeed("clearSearch")}
                          className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </label>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 rounded-xl border-border bg-transparent px-4 text-xs font-semibold sm:w-auto"
                    >
                      <Link href={searchHref}>
                        <SlidersHorizontal className="size-4" />
                        {tFeed("advancedSearch")}
                      </Link>
                    </Button>
                  </div>
                </div>

                <aside className="hidden pb-1 lg:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {tFeed("atAGlance")}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-5">
                    <div className="border-l-2 border-brand/35 pl-4">
                      <strong className="block text-3xl font-bold tracking-[-0.04em] text-foreground">
                        {primaryMetric}
                      </strong>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {isEmployee
                          ? tFeed("availableCompanies")
                          : tFeed("availableTalent")}
                      </span>
                    </div>
                    <div className="border-l-2 border-border pl-4">
                      <strong className="block text-3xl font-bold tracking-[-0.04em] text-foreground">
                        {secondaryMetric}
                      </strong>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {isEmployee
                          ? tFeed("openRolesStat")
                          : tFeed("topMatchesStat")}
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          </FadeIn>

          {/* Focused Shortlist Section: Recommendations are intentionally capped */}
          {!hasSearch &&
            (isEmployee
              ? featuredCompanies.length > 0
              : featuredEmployees.length > 0) && (
              <FadeIn className="flex w-full flex-col gap-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {tFeed("topMatches")}
                      </h2>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {isEmployee
                        ? tFeed("companyMatchesDescription")
                        : tFeed("talentMatchesDescription")}
                    </p>
                  </div>
                  <Link
                    href={searchHref}
                    className="hidden items-center gap-1.5 text-xs font-semibold text-primary transition hover:text-primary/75 sm:flex"
                  >
                    {tFeed("seeMore")}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className={FEATURED_GRID_CLASS}>
                  {isEmployee
                    ? featuredCompanies.map((company) => (
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
                    : featuredEmployees.map((employee) => (
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
            )}

          {recommendationsError &&
            !hasSearch &&
            featuredCompanies.length === 0 &&
            featuredEmployees.length === 0 && (
              <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4" />
                  {tFeed("recommendationsUnavailable")}
                </span>
                {retryId && (
                  <Button
                    variant="ghost"
                    className="h-10 rounded-xl text-xs"
                    onClick={() => {
                      recsFetchedForRef.current = null;
                      setRecsHasFetched(false);
                      retryRecommendations(retryId).finally(() =>
                        setRecsHasFetched(true),
                      );
                    }}
                  >
                    {tFeed("retry")}
                  </Button>
                )}
              </div>
            )}

          {/* Browsable and Non-Duplicated Discovery Results Section */}
          <section
            className="flex w-full flex-col gap-4"
            aria-labelledby="feed-discovery-title"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2">
                  {isEmployee ? (
                    <Building2 className="size-4 text-primary" />
                  ) : (
                    <Users className="size-4 text-primary" />
                  )}
                  <h2
                    id="feed-discovery-title"
                    className="text-xl font-bold tracking-tight sm:text-2xl"
                  >
                    {hasSearch
                      ? tFeed("searchResults")
                      : isEmployee
                        ? tFeed("exploreCompanies")
                        : tFeed("exploreTalent")}
                  </h2>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {tFeed("resultCount", { count: discoveryCount })}
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <span>{tFeed("sortBy")}</span>
                <select
                  value={sortMode}
                  onChange={(event) =>
                    setSortMode(event.target.value as "recommended" | "az")
                  }
                  className="h-11 min-w-36 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                >
                  <option value="recommended">
                    {tFeed("sortRecommended")}
                  </option>
                  <option value="az">{tFeed("sortAZ")}</option>
                </select>
              </label>
            </div>

            {discoveryCount > 0 ? (
              <div className={DISCOVERY_GRID_CLASS}>
                {isEmployee
                  ? visibleCompanies.map((company) => (
                      <MemoCompanyFeedCard
                        key={company.id}
                        company={company}
                        employeeId={currentUser?.employee?.id ?? ""}
                        isLiking={
                          company.id === likingId && employeeLikeLoading
                        }
                        isSaving={company.id === savingId}
                        isFavorite={isEmpFavorite(company.id)}
                        onView={handleEmployeeViewCompany}
                        onLike={handleEmployeeLikeCompany}
                        onSave={handleEmployeeFavoriteCompany}
                        onProfileImageClick={handleClickProfilePopup}
                        onSetProfileImage={setCurrentProfileImage}
                      />
                    ))
                  : visibleEmployees.map((employee) => (
                      <MemoEmployeeFeedCard
                        key={employee.id}
                        employee={employee}
                        companyId={currentUser?.company?.id ?? ""}
                        isLiking={
                          employee.id === likingId && companyLikeLoading
                        }
                        isSaving={employee.id === savingId}
                        isFavorite={isCmpFavorite(employee.id)}
                        onView={handleCompanyViewEmployee}
                        onLike={handleCompanyLikeEmployee}
                        onSave={handleCompanyFavoriteEmployee}
                        onProfileImageClick={handleClickProfilePopup}
                        onSetProfileImage={setCurrentProfileImage}
                      />
                    ))}
              </div>
            ) : (
              <div className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center">
                <EditorialIllustration variant="discovery" />
                <h3 className="mt-5 text-base font-bold">
                  {hasSearch
                    ? tFeed("noSearchResults")
                    : isEmployee
                      ? tFeed("companyListEmpty")
                      : tFeed("employeeListEmpty")}
                </h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {hasSearch
                    ? tFeed("tryAnotherSearch")
                    : tFeed("emptyDiscoveryDescription")}
                </p>
                {hasSearch ? (
                  <Button
                    variant="outline"
                    className="mt-4 h-11 rounded-xl"
                    onClick={() => setSearchQuery("")}
                  >
                    {tFeed("clearSearch")}
                  </Button>
                ) : (
                  <Button asChild className="mt-4 h-11 rounded-xl">
                    <Link href={searchHref}>
                      {isEmployee
                        ? tFeed("exploreAllCompanies")
                        : tFeed("exploreAllTalent")}
                    </Link>
                  </Button>
                )}
              </div>
            )}

            {visibleCount < discoveryCount && (
              <Button
                type="button"
                variant="outline"
                className="mx-auto h-11 min-w-36 rounded-xl"
                onClick={() =>
                  setVisibleCount((count) => count + FEED_PAGE_SIZE)
                }
              >
                {tFeed("loadMore")}
              </Button>
            )}

            {discoveryCount > 0 && visibleCount >= discoveryCount && (
              <div className="flex items-center gap-3 py-4 text-center">
                <div className="h-px flex-1 bg-border/60" />
                <span className="shrink-0 text-xs font-medium text-muted-foreground/70">
                  {tFeed("endOfResults")}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
            )}
          </section>
        </>
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
