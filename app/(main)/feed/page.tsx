"use client";

import EmployeeCard from "@/components/employee/employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import feedCompanySvg from "@/assets/svg/feed-company.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useRouter } from "next/navigation";
import CompanyCard from "@/components/company/company-card";
import ImagePopup from "@/components/utils/image-popup";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import CompanyCardSkeleton from "@/components/company/company-card/skeleton";
import BannerSkeleton from "./banner-skeleton";
import { useEmployeeLikeStore } from "@/stores/apis/matching/employee-like.store";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetCurrentEmployeeLikedStore } from "@/stores/apis/matching/get-current-employee-liked.store";
import { useGetCurrentCompanyLikedStore } from "@/stores/apis/matching/get-current-company-liked.store";
import { useCompanyLikeStore } from "@/stores/apis/matching/company-like.store";
import { useEmployeeFavCompanyStore } from "@/stores/apis/favorite/employee-fav-company.store";
import { useCompanyFavEmployeeStore } from "@/stores/apis/favorite/company-fav-employee.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";
import { usePreloadImages } from "@/hooks/use-cached-image";
import emptySvgImage from "@/assets/svg/empty.svg";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useGetAllCompanyStore } from "@/stores/apis/company/get-all-cmp.store";
import { useGetAllEmployeeStore } from "@/stores/apis/employee/get-all-emp.store";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useFetchOnce } from "@/hooks/use-fetch-once";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useToast } from "@/hooks/use-toast";
import { LucideBookMarked, LucideX } from "lucide-react";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";

// Module-level Cache For Global Data (survives Strict Mode)
const globalFetchCache = {
  companies: false,
  employees: false,
};

export default function FeedPage() {
  // Utils
  const { toast } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  // Pop up Dialog
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);
  const [openLikeSuccessDialog, setOpenLikeSuccessDialog] = useState<boolean>(false);

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

  // API Integration
  // User Stores
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const getAllCompanyStore = useGetAllCompanyStore();
  const getAllEmployeeStore = useGetAllEmployeeStore();

  // Liked Store
  const employeeLikeStore = useEmployeeLikeStore();
  const companyLikeStore = useCompanyLikeStore();
  const getCurrentEmployeeLikedStore = useGetCurrentEmployeeLikedStore();
  const getCurrentCompanyLikedStore = useGetCurrentCompanyLikedStore();
  // Liked Helper
  const [likingId, setLikingId] = useState<string | null>(null);

  // Favorite Stores
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  // Count All Employee and Company Favorites To Update Badge In Sidebar
  const countAllEmployeeFavoritesStore = useCountAllEmployeeFavoritesStore();
  const countAllCompanyFavoritesStore = useCountAllCompanyFavoritesStore();

  // Matching Stores
  const getCurrentEmployeeMatchingStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCompanyMatchingStore = useGetCurrentCompanyLikedStore();
  // Count All Employee and Company Matching To Update Badge In Sidebar
  const { countCurrentEmployeeMatching } = useCountCurrentEmployeeMatchingStore();
  const { countCurrentCompanyMatching } = useCountCurrentCompanyMatchingStore();

  // Step 1: Fetch All Current Employee or Company Liked - User Specific Data (Reset When User Change)
  const { isEmployee } = useFetchOnce({
    cacheKey: "feed-page",
    onEmployeeFetch: (employeeId) => {
      console.log("Querying employee liked inside Feed Page!!!");
      getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(employeeId);
    },
    onCompanyFetch: (companyId) => {
      console.log("Querying company liked inside Feed Page!!!");
      getCurrentCompanyLikedStore.queryCurrentCompanyLiked(companyId);
    },
  });

  // Step 2: Fetch All Companies or Employees - Global Data (Only Once, Never Resets)
  // Safe Mode: Fetch Only 1 Time
  useEffect(() => {
    if (!currentUser) return;

    if (isEmployee) {
      if (!globalFetchCache.companies) {
        console.log("Querying all companies inside Feed Page!!!");
        getAllCompanyStore.queryCompany();
        globalFetchCache.companies = true;
      }
    } else {
      if (!globalFetchCache.employees) {
        console.log("Querying all employees inside Feed Page!!!");
        getAllEmployeeStore.queryEmployee();
        globalFetchCache.employees = true;
      }
    }
  }, [isEmployee, currentUser, getAllCompanyStore, getAllEmployeeStore]);

  // Step 3: Filter Users Based on Role
  // If User is Employee filter -> Companies (Filter Out Current Employee Liked)
  // If User is Company filter -> Employees (Filter Out Current Company Liked)
  const allUsers: ICompany[] | IEmployee[] = useMemo(() => {
    if (!currentUser) return [];

    let users: ICompany[] | IEmployee[] = [];

    if (isEmployee) {
      users = getAllCompanyStore.companyData ?? [];
      const currentEmployeeLiked =
        getCurrentEmployeeLikedStore.currentEmployeeLiked;
      if (currentEmployeeLiked) {
        users = users.filter((company) => {
          const companyId = company.id;
          return (
            companyId &&
            !currentEmployeeLiked.some((liked) => liked.id === companyId)
          );
        });
      }
    } else {
      users = getAllEmployeeStore.employeesData ?? [];
      const currentCompanyLiked =
        getCurrentCompanyLikedStore.currentCompanyLiked;
      if (currentCompanyLiked) {
        users = users.filter((employee) => {
          const employeeId = employee.id;
          return (
            employeeId &&
            !currentCompanyLiked.some((liked) => liked.id === employeeId)
          );
        });
      }
    }

    return users;
  }, [
    currentUser,
    isEmployee,
    getAllCompanyStore.companyData,
    getAllEmployeeStore.employeesData,
    getCurrentEmployeeLikedStore.currentEmployeeLiked,
    getCurrentCompanyLikedStore.currentCompanyLiked,
  ]);

  // Handle Employee Like Company
  const handleEmployeeLikeCompany = async (
    employeeID: string,
    companyID: string,
  ) => {
    if (!employeeID || !companyID) return;
    setLikingId(companyID);
    try {
      // Employee Liked Company
      await employeeLikeStore.employeeLike(employeeID, companyID);
      // Count Current Employee Matching -> Update Matching Badge in Sidebar
      countCurrentEmployeeMatching(employeeID);
      setOpenLikeSuccessDialog(true);
      // Get Current Employee Liked -> Update All Users (Filter Out Current Employee Liked)
      await getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(employeeID);
    } finally {
      setLikingId(null);
      // Get Current Company Matching -> Update In Matching Page (Incase There's a Matching)
      getCurrentCompanyMatchingStore.queryCurrentCompanyLiked(companyID);
    }
  };

  // Handle Company Like Employee
  const handleCompanyLikeEmployee = async (
    companyID: string,
    employeeID: string,
  ) => {
    if (!companyID || !employeeID) return;
    setLikingId(employeeID);
    try {
      // Company Liked Employee
      await companyLikeStore.companyLike(companyID, employeeID);
      // Count Current Company Matching -> Update Matching Badge in Sidebar
      countCurrentCompanyMatching(companyID);
      setOpenLikeSuccessDialog(true);
      // Get Current Company Liked -> Update All Users (Filter Out Current Company Liked)
      await getCurrentCompanyLikedStore.queryCurrentCompanyLiked(companyID);
    } finally {
      setLikingId(null);
       // Get Current Company Matching -> Update In Matching Page (Incase There's a Matching)
      getCurrentEmployeeMatchingStore.queryCurrentEmployeeMatching(employeeID);
    }
  };

  // Handle Employee Favorite Company
  const handleEmployeeFavoriteCompany = async (
    employeeID: string,
    companyID: string,
    companyName: string,
  ) => {
    if (!employeeID || !companyID) return;
    try {
      // Employee Favorite Company
      await employeeFavCompanyStore.addCompanyToFavorite(employeeID, companyID);
      // Count All Employee Favorite -> Update Favorite Badge In Sidebar
      countAllEmployeeFavoritesStore.countAllEmployeeFavorites(employeeID);
      toast({
        variant: "success",
        description: (
          <div className="flex items-center gap-2">
            <LucideBookMarked />
            <TypographySmall className="font-medium leading-relaxed">
              {companyName} added to favorites.
            </TypographySmall>
          </div>
        ),
      });
      // Get All Employee Favorites -> Upddate Favorite Page
      await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(employeeID);
    } catch (error) {
      const err =
        employeeFavCompanyStore.error || "Failed to save company to favorites.";
      toast({
        variant: "destructive",
        description: (
          <div className="flex items-center gap-2">
            <LucideX />
            <TypographySmall className="font-medium leading-relaxed">
              {err}
            </TypographySmall>
          </div>
        ),
      });
    }
  };

  // Handle Company Favorite Employee
  const handleCompanyFavoriteEmployee = async (
    companyID: string,
    employeeID: string,
    employeeName: string,
  ) => {
    if (!companyID || !employeeID) return;
    try {
      // Company Favorite Employee
      await companyFavEmployeeStore.addEmployeeToFavorite(
        companyID,
        employeeID,
      );
      // Count All Company Favorite -> Update Favorite Badge In Sidebar
      countAllCompanyFavoritesStore.countAllCompanyFavorites(companyID);
      toast({
        variant: "success",
        description: (
          <div className="flex items-center gap-2">
            <LucideBookMarked />
            <TypographySmall className="font-medium leading-relaxed">
              {employeeName} added to favorites.
            </TypographySmall>
          </div>
        ),
      });
      // Get All Company Favorites -> Upddate Favorite Page
      await getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyID);
    } catch (error) {
      const err = companyFavEmployeeStore.error || "Failed to save employee";
      toast({
        variant: "destructive",
        description: (
          <div className="flex items-center gap-2">
            <LucideBookMarked />
            <TypographySmall className="font-medium leading-relaxed">
              {err}
            </TypographySmall>
          </div>
        ),
      });
    }
  };

  // Preload Profile Avatar For Better Performance (useCachedImage Hook)
  const profileImageUrls = useMemo(() => {
    return allUsers.map((user) => user.avatar).filter(Boolean);
  }, [allUsers]);
  usePreloadImages(profileImageUrls);

  // Compute All Loading States
  const isLoading =
    !mounted ||
    !currentUser ||
    (isEmployee &&
      (getAllCompanyStore.loading || getCurrentEmployeeLikedStore.loading)) ||
    (!isEmployee &&
      (getAllEmployeeStore.loading || getCurrentCompanyLikedStore.loading));

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
            />
          ) : (
            <Image
              src={feedWhiteSvg}
              alt="feed"
              height={250}
              width={350}
              className="tablet-xl:!w-full"
            />
          )}
        </div>
      )}

      {/* Feed Card Section */}
      <div className="w-full grid grid-cols-3 gap-5 laptop-sm:grid-cols-2 tablet-lg:!grid-cols-1 phone-xl:gap-3">
        {/* Loading Skeleton Section */}
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) =>
            isEmployee ? (
              <CompanyCardSkeleton key={`company-skeleton-${index}`} />
            ) : (
              <EmployeeCardSkeleton key={`employee-skeleton-${index}`} />
            ),
          )
        ) : allUsers.length > 0 ? (
          // Card List Section
          allUsers.map((user) =>
            isEmployee ? (
              // Company Card Section
              <CompanyCard
                key={user.id}
                {...(user as ICompany)}
                id={user.id}
                onViewClick={() => {
                  router.push(`/feed/company/${user.id}`);
                }}
                onSaveClick={() => {
                  if (currentUser && currentUser.employee) {
                    const company = user as ICompany;

                    const employeeID = currentUser.employee.id;
                    const companyID = company.id;
                    const companyName = company.name;
                    handleEmployeeFavoriteCompany(
                      employeeID,
                      companyID,
                      companyName ?? "Company",
                    );
                  }
                }}
                hideSaveButton={employeeFavCompanyStore.isFavorite(user.id)}
                onLikeClick={() => {
                  if (currentUser && currentUser.employee) {
                    const employeeID = currentUser.employee.id;
                    const companyID = user.id;
                    handleEmployeeLikeCompany(employeeID, companyID);
                  }
                }}
                onLikeClickDisable={
                  user.id === likingId && employeeLikeStore.loading
                }
                onProfileImageClick={(e: React.MouseEvent) => {
                  if (user.avatar) {
                    handleClickProfilePopup(e);
                    setCurrentProfileImage(user.avatar);
                  }
                }}
              />
            ) : (
              // Employee Card Section
              <EmployeeCard
                key={user.id}
                {...(user as IEmployee)}
                id={user.id}
                onSaveClick={async () => {
                  if (currentUser && currentUser.company) {
                    const employee = user as IEmployee;

                    const companyID = currentUser.company.id;
                    const employeeID = employee.id;
                    const employeeName = employee.username;
                    handleCompanyFavoriteEmployee(
                      companyID,
                      employeeID,
                      employeeName ?? "Employee",
                    );
                  }
                }}
                hideSaveButton={companyFavEmployeeStore.isFavorite(user.id)}
                onViewClick={() => router.push(`/feed/employee/${user.id}`)}
                onLikeClick={() => {
                  if (currentUser && currentUser.company) {
                    const companyID = currentUser.company.id;
                    const employeeID = user.id;
                    handleCompanyLikeEmployee(companyID, employeeID);
                  }
                }}
                onLikeClickDisable={
                  user.id === likingId && companyLikeStore.loading
                }
                onProfileImageClick={(e: React.MouseEvent) => {
                  if (user.avatar) {
                    handleClickProfilePopup(e);
                    setCurrentProfileImage(user.avatar);
                  }
                }}
              />
            ),
          )
        ) : (
          // No User Available Section
          <div className="col-span-3 laptop-sm:col-span-2 tablet-lg:col-span-1 flex flex-col items-center justify-center my-16">
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
