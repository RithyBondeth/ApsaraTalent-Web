"use client";

import emptySvgImage from "@/assets/svg/empty.svg";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedCompanySvg from "@/assets/svg/feed-company.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import CompanyCard from "@/components/company/company-card";
import CompanyCardSkeleton from "@/components/company/company-card/skeleton";
import EmployeeCard from "@/components/employee/employee-card";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import ImagePopup from "@/components/utils/image-popup";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { usePreloadImages } from "@/hooks/use-cached-image";
import { useFetchOnce } from "@/hooks/use-fetch-once";
import { toast } from "sonner";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import BannerSkeleton from "./banner-skeleton";

// Module-level Cache For Global Data (survives Strict Mode)
const globalFetchCache = {
  companies: false,
  employees: false,
};

// ---------------------------------------------------------------------------
// Memoized card wrappers — stable identity prevents full list re-renders
// ---------------------------------------------------------------------------
type CompanyFeedCardProps = {
  company: ICompany;
  employeeId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (employeeId: string, companyId: string) => void;
  onSave: (employeeId: string, companyId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
};

const CompanyFeedCard = React.memo(function CompanyFeedCard({
  company,
  employeeId,
  isLiking,
  isFavorite,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: CompanyFeedCardProps) {
  return (
    <div
      className={`break-inside-avoid mb-5${isLiking ? " animate-card-pop-shrink" : ""}`}
    >
      <CompanyCard
        {...company}
        id={company.id}
        onViewClick={() => onView(company.id)}
        onSaveClick={() =>
          onSave(employeeId, company.id, company.name ?? "Company")
        }
        hideSaveButton={isFavorite}
        onLikeClick={() => onLike(employeeId, company.id)}
        onLikeClickDisable={isLiking}
        onProfileImageClick={(e: React.MouseEvent) => {
          if (company.avatar) {
            onProfileImageClick(e);
            onSetProfileImage(company.avatar);
          }
        }}
      />
    </div>
  );
});

type EmployeeFeedCardProps = {
  employee: IEmployee;
  companyId: string;
  isLiking: boolean;
  isFavorite: boolean;
  onView: (id: string) => void;
  onLike: (companyId: string, employeeId: string) => void;
  onSave: (companyId: string, employeeId: string, name: string) => void;
  onProfileImageClick: (e: React.MouseEvent) => void;
  onSetProfileImage: (url: string) => void;
};

const EmployeeFeedCard = React.memo(function EmployeeFeedCard({
  employee,
  companyId,
  isLiking,
  isFavorite,
  onView,
  onLike,
  onSave,
  onProfileImageClick,
  onSetProfileImage,
}: EmployeeFeedCardProps) {
  return (
    <div
      className={`break-inside-avoid mb-5${isLiking ? " animate-card-pop-shrink" : ""}`}
    >
      <EmployeeCard
        {...employee}
        id={employee.id}
        onViewClick={() => onView(employee.id)}
        onSaveClick={() =>
          onSave(companyId, employee.id, employee.username ?? "Employee")
        }
        hideSaveButton={isFavorite}
        onLikeClick={() => onLike(companyId, employee.id)}
        onLikeClickDisable={isLiking}
        onProfileImageClick={(e: React.MouseEvent) => {
          if (employee.avatar) {
            onProfileImageClick(e);
            onSetProfileImage(employee.avatar);
          }
        }}
      />
    </div>
  );
});
// ---------------------------------------------------------------------------

export default function FeedPage() {
  // Utils
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  // Pop up Dialog
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(
    null,
  );
  const [openLikeSuccessDialog, setOpenLikeSuccessDialog] =
    useState<boolean>(false);

  // Handle Profile Pop up Dialog
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  // Open Profile Pop up Dialog Effect
  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  // API Integration — field selectors to avoid re-renders from unrelated store changes
  const currentUser = useGetCurrentUserStore((s) => s.user);

  // All Companies / Employees data
  const companyData = useGetAllCompanyStore((s) => s.companyData);
  const companyLoading = useGetAllCompanyStore((s) => s.loading);
  const queryCompany = useGetAllCompanyStore((s) => s.queryCompany);

  const employeesData = useGetAllEmployeeStore((s) => s.employeesData);
  const employeeLoading = useGetAllEmployeeStore((s) => s.loading);
  const queryEmployee = useGetAllEmployeeStore((s) => s.queryEmployee);

  // Liked stores
  const employeeLike = useEmployeeLikeStore((s) => s.employeeLike);
  const employeeLikeLoading = useEmployeeLikeStore((s) => s.loading);
  const companyLike = useCompanyLikeStore((s) => s.companyLike);
  const companyLikeLoading = useCompanyLikeStore((s) => s.loading);

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

  // Liked helper
  const [likingId, setLikingId] = useState<string | null>(null);

  // Favorite stores
  const addCompanyToFavorite = useEmployeeFavCompanyStore(
    (s) => s.addCompanyToFavorite,
  );
  const empFavError = useEmployeeFavCompanyStore((s) => s.error);
  // Subscribe to the Set directly so the page re-renders when favorites change
  const favoriteCompanyIds = useEmployeeFavCompanyStore(
    (s) => s.favoriteCompanyIds,
  );
  const isEmpFavorite = (id: string) => favoriteCompanyIds.has(id);

  const addEmployeeToFavorite = useCompanyFavEmployeeStore(
    (s) => s.addEmployeeToFavorite,
  );
  const cmpFavError = useCompanyFavEmployeeStore((s) => s.error);
  const favoriteEmployeeIds = useCompanyFavEmployeeStore(
    (s) => s.favoriteEmployeeIds,
  );
  const isCmpFavorite = (id: string) => favoriteEmployeeIds.has(id);

  const queryAllEmployeeFavorites = useGetAllEmployeeFavoritesStore(
    (s) => s.queryAllEmployeeFavorites,
  );
  const queryAllCompanyFavorites = useGetAllCompanyFavoritesStore(
    (s) => s.queryAllCompanyFavorites,
  );

  const countAllEmployeeFavorites = useCountAllEmployeeFavoritesStore(
    (s) => s.countAllEmployeeFavorites,
  );
  const countAllCompanyFavorites = useCountAllCompanyFavoritesStore(
    (s) => s.countAllCompanyFavorites,
  );

  // Matching stores
  const queryCurrentEmployeeMatching = useGetCurrentEmployeeMatchingStore(
    (s) => s.queryCurrentEmployeeMatching,
  );
  const queryCurrentCompanyLikedFn = useGetCurrentCompanyLikedStore(
    (s) => s.queryCurrentCompanyLiked,
  );
  const countCurrentEmployeeMatching = useCountCurrentEmployeeMatchingStore(
    (s) => s.countCurrentEmployeeMatching,
  );
  const countCurrentCompanyMatching = useCountCurrentCompanyMatchingStore(
    (s) => s.countCurrentCompanyMatching,
  );

  // Step 1: Fetch All Current Employee or Company Liked - User Specific Data (Reset When User Change)
  const { isEmployee } = useFetchOnce({
    cacheKey: "feed-page",
    onEmployeeFetch: queryCurrentEmployeeLiked,
    onCompanyFetch: queryCurrentCompanyLiked,
  });

  // Stable refs for store methods — prevents useEffect from re-running when
  // Zustand creates new function references on each render
  const queryCompanyRef = useRef(queryCompany);
  const queryEmployeeRef = useRef(queryEmployee);
  useEffect(() => {
    queryCompanyRef.current = queryCompany;
    queryEmployeeRef.current = queryEmployee;
  });

  // Step 2: Fetch All Companies or Employees - Global Data (Only Once, Never Resets)
  useEffect(() => {
    if (!currentUser) return;

    if (isEmployee) {
      if (!globalFetchCache.companies) {
        queryCompanyRef.current();
        globalFetchCache.companies = true;
      }
    } else {
      if (!globalFetchCache.employees) {
        queryEmployeeRef.current();
        globalFetchCache.employees = true;
      }
    }
  }, [isEmployee, currentUser]);

  // Step 3: Filter Users Based on Role
  // If User is Employee filter -> Companies (Filter Out Current Employee Liked)
  // If User is Company filter -> Employees (Filter Out Current Company Liked)
  const allUsers: ICompany[] | IEmployee[] = useMemo(() => {
    if (!currentUser) return [];

    if (isEmployee) {
      const users = companyData ?? [];
      if (currentEmployeeLiked) {
        return users.filter(
          (company) =>
            company.id &&
            !currentEmployeeLiked.some((liked) => liked.id === company.id),
        );
      }
      return users;
    } else {
      const users = employeesData ?? [];
      if (currentCompanyLiked) {
        return users.filter(
          (employee) =>
            employee.id &&
            !currentCompanyLiked.some((liked) => liked.id === employee.id),
        );
      }
      return users;
    }
  }, [
    currentUser,
    isEmployee,
    companyData,
    employeesData,
    currentEmployeeLiked,
    currentCompanyLiked,
  ]);

  // Handle Employee Like Company
  const handleEmployeeLikeCompany = useCallback(
    async (employeeID: string, companyID: string) => {
      if (!employeeID || !companyID) return;
      setLikingId(companyID);

      // Optimistic update — remove card instantly before API responds
      const company = companyData?.find((c) => c.id === companyID);
      if (company) optimisticAddEmployeeLiked(company);

      try {
        await employeeLike(employeeID, companyID);
        countCurrentEmployeeMatching(employeeID);
        setOpenLikeSuccessDialog(true);
        // Sync with server to confirm (replaces optimistic state)
        await queryCurrentEmployeeLiked(employeeID);
      } finally {
        setLikingId(null);
      }
    },
    [
      employeeLike,
      countCurrentEmployeeMatching,
      queryCurrentEmployeeLiked,
      optimisticAddEmployeeLiked,
      companyData,
    ],
  );

  // Handle Company Like Employee
  const handleCompanyLikeEmployee = useCallback(
    async (companyID: string, employeeID: string) => {
      if (!companyID || !employeeID) return;
      setLikingId(employeeID);

      // Optimistic update — remove card instantly before API responds
      const employee = employeesData?.find((e) => e.id === employeeID);
      if (employee) optimisticAddCompanyLiked(employee);

      try {
        await companyLike(companyID, employeeID);
        countCurrentCompanyMatching(companyID);
        setOpenLikeSuccessDialog(true);
        // Sync with server to confirm (replaces optimistic state)
        // Bug fix: was calling queryCurrentEmployeeMatching (wrong store) — now correctly
        // re-fetches the liked list so the filter stays accurate.
        await queryCurrentCompanyLiked(companyID);
      } finally {
        setLikingId(null);
      }
    },
    [
      companyLike,
      countCurrentCompanyMatching,
      queryCurrentCompanyLiked,
      optimisticAddCompanyLiked,
      employeesData,
    ],
  );

  // Handle Employee Favorite Company
  const handleEmployeeFavoriteCompany = useCallback(
    async (employeeID: string, companyID: string, companyName: string) => {
      if (!employeeID || !companyID) return;
      try {
        await addCompanyToFavorite(employeeID, companyID);
        countAllEmployeeFavorites(employeeID);
        toast.success(`${companyName} added to favorites.`);
        await queryAllEmployeeFavorites(employeeID);
      } catch (error) {
        toast.error(empFavError || "Failed to save company to favorites.");
      }
    },
    [
      addCompanyToFavorite,
      countAllEmployeeFavorites,
      queryAllEmployeeFavorites,
      empFavError,
    ],
  );

  // Handle Company Favorite Employee
  const handleCompanyFavoriteEmployee = useCallback(
    async (companyID: string, employeeID: string, employeeName: string) => {
      if (!companyID || !employeeID) return;
      try {
        await addEmployeeToFavorite(companyID, employeeID);
        countAllCompanyFavorites(companyID);
        toast.success(`${employeeName} added to favorites.`);
        await queryAllCompanyFavorites(companyID);
      } catch (error) {
        toast.error(cmpFavError || "Failed to save employee");
      }
    },
    [
      addEmployeeToFavorite,
      countAllCompanyFavorites,
      queryAllCompanyFavorites,
      cmpFavError,
    ],
  );

  // Stable view handlers for memoized cards
  const handleEmployeeViewCompany = useCallback(
    (id: string) => router.push(`/feed/company/${id}`),
    [router],
  );
  const handleCompanyViewEmployee = useCallback(
    (id: string) => router.push(`/feed/employee/${id}`),
    [router],
  );

  // Preload Profile Avatar For Better Performance (useCachedImage Hook)
  const profileImageUrls = useMemo(() => {
    return allUsers.map((user) => user.avatar).filter(Boolean);
  }, [allUsers]);
  usePreloadImages(profileImageUrls);

  // Compute All Loading States
  const isLoading =
    !mounted ||
    !currentUser ||
    (isEmployee && (companyLoading || currentEmployeeLikedLoading)) ||
    (!isEmployee && (employeeLoading || currentCompanyLikedLoading));

  // Get Image Based On Theme
  const feedImage =
    mounted && resolvedTheme === "dark" ? feedBlackSvg : feedWhiteSvg;
  const feedCompanyImage = feedCompanySvg;

  return (
    <div className="w-full flex flex-col items-start gap-5">
      {/* Header Section */}
      {isLoading ? (
        <BannerSkeleton />
      ) : isEmployee ? (
        <div className="w-full flex items-center justify-between gap-10 tablet-xl:flex-col tablet-xl:items-center">
          {/* Employee Banner - Content Section */}
          <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
            <TypographyH2 className="!leading-relaxed text-4xl tablet-xl:text-3xl tablet-xl:text-center">
              Connect with global professionals and grow your network
            </TypographyH2>
            <TypographyH4 className="!leading-relaxed tablet-xl:text-center">
              Start your journey toward a career you love.
            </TypographyH4>
            <TypographyH4 className="!leading-relaxed tablet-xl:text-center">
              Build meaningful connections that open doors to new opportunities.
            </TypographyH4>
            <TypographyMuted className="!leading-relaxed tablet-xl:text-center">
              Land your dream job with ease — no matter where you are.
            </TypographyMuted>
          </div>

          {/* Employee Banner - Image Poster Section */}
          <Image
            src={feedCompanyImage}
            alt="feed"
            height={300}
            width={400}
            className="tablet-xl:!w-full"
            priority
          />
        </div>
      ) : (
        <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
          {/* Company Banner - Content Section */}
          <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
            <TypographyH2 className="leading-relaxed tablet-xl:text-center">
              Find Top Talent from Anywhere
            </TypographyH2>
            <TypographyH4 className="leading-relaxed tablet-xl:text-center">
              Build your dream team effortlessly, no matter where you are.
            </TypographyH4>
            <TypographyMuted className="leading-relaxed tablet-xl:text-center">
              Post jobs, review profiles, and hire faster — all in one place
            </TypographyMuted>
          </div>
          {/* Company Banner - Image Poster Section */}
          {mounted ? (
            <Image
              src={feedImage}
              alt="feed"
              height={250}
              width={350}
              className="tablet-xl:!w-full"
              priority
            />
          ) : (
            <Image
              src={feedWhiteSvg}
              alt="feed"
              height={250}
              width={350}
              className="tablet-xl:!w-full"
              priority
            />
          )}
        </div>
      )}

      {/* Feed Card Section */}
      <div className="w-full columns-3 gap-5 laptop-sm:columns-2 tablet-lg:!columns-1 phone-xl:gap-3">
        {/* Loading Skeleton Section */}
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) =>
            isEmployee ? (
              <div
                key={`company-skeleton-${index}`}
                className="break-inside-avoid mb-5"
              >
                <CompanyCardSkeleton />
              </div>
            ) : (
              <div
                key={`employee-skeleton-${index}`}
                className="break-inside-avoid mb-5"
              >
                <EmployeeCardSkeleton />
              </div>
            ),
          )
        ) : allUsers.length > 0 ? (
          // Card List Section
          allUsers.map((user) =>
            isEmployee ? (
              // Company Card Section
              <CompanyFeedCard
                key={user.id}
                company={user as ICompany}
                employeeId={currentUser?.employee?.id ?? ""}
                isLiking={user.id === likingId && employeeLikeLoading}
                isFavorite={isEmpFavorite(user.id)}
                onView={handleEmployeeViewCompany}
                onLike={handleEmployeeLikeCompany}
                onSave={handleEmployeeFavoriteCompany}
                onProfileImageClick={handleClickProfilePopup}
                onSetProfileImage={setCurrentProfileImage}
              />
            ) : (
              // Employee Card Section
              <EmployeeFeedCard
                key={user.id}
                employee={user as IEmployee}
                companyId={currentUser?.company?.id ?? ""}
                isLiking={user.id === likingId && companyLikeLoading}
                isFavorite={isCmpFavorite(user.id)}
                onView={handleCompanyViewEmployee}
                onLike={handleCompanyLikeEmployee}
                onSave={handleCompanyFavoriteEmployee}
                onProfileImageClick={handleClickProfilePopup}
                onSetProfileImage={setCurrentProfileImage}
              />
            ),
          )
        ) : (
          // No User Available Section
          <div className="flex flex-col items-center justify-center my-16">
            <Image src={emptySvgImage} alt="empty" height={200} width={200} />
            <TypographyP className="!m-0">No user available</TypographyP>
          </div>
        )}
      </div>
      {/* Image Popup Section */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={currentProfileImage!}
      />
      {/* Like Success Dialog Section */}
      <Dialog
        open={openLikeSuccessDialog}
        onOpenChange={setOpenLikeSuccessDialog}
      >
        <DialogContent>
          <DialogTitle>You liked this successfully!</DialogTitle>
          <DialogFooter>
            <Button onClick={() => setOpenLikeSuccessDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
