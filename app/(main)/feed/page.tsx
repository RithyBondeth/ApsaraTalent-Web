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
import { toast } from "@/hooks/use-toast";
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

export default function FeedPage() {
  // Utils
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  // Theme
  const { resolvedTheme } = useTheme();

  // Always use light theme initially to prevent hydration mismatch
  const feedImage =
    mounted && resolvedTheme === "dark" ? feedBlackSvg : feedWhiteSvg;
  const feedCompanyImage = feedCompanySvg;

  // Pop up Dialog
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(
    null
  );

  // Profile Pop up Dialog
  const handleClickProfilePopup = (e: React.MouseEvent) => {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }

    if ((e.target as HTMLElement).closest(".dialog-content")) return;
    setOpenProfilePopup(true);
  };

  useEffect(() => {
    if (openProfilePopup) {
      ignoreNextClick.current = true;
      setTimeout(() => (ignoreNextClick.current = false), 200);
    }
  }, [openProfilePopup]);

  // Dialog state for like success
  const [openLikeSuccessDialog, setOpenLikeSuccessDialog] =
    useState<boolean>(false);

  // API Integration
  const employeeLikeStore = useEmployeeLikeStore();
  const companyLikeStore = useCompanyLikeStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  const getCurrentEmployeeLikedStore = useGetCurrentEmployeeLikedStore();
  const getCurrentCompanyLikedStore = useGetCurrentCompanyLikedStore();
  const getCurrentEmployeeMatchingStore = useGetCurrentEmployeeMatchingStore();
  const getCurrentCompanyMatchingStore = useGetCurrentCompanyLikedStore();
  const getAllCompanyStore = useGetAllCompanyStore();
  const getAllEmployeeStore = useGetAllEmployeeStore();

  // Get current user from store
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const [likingId, setLikingId] = useState<string | null>(null);

  // Refs to track if global data has been fetched (only once ever)
  const hasFetchedGlobalDataRef = useRef(false);

  // Fetch current user employee or company - liked user-specific data (resets when user changes)
  const { isEmployee } = useFetchOnce({
    onEmployeeFetch: (employeeId) => {
      console.log("Querying employee liked inside Feed Page!!!");
      getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(employeeId);
    },
    onCompanyFetch: (companyId) => {
      console.log("Querying company liked inside Feed Page!!!");
      getCurrentCompanyLikedStore.queryCurrentCompanyLiked(companyId);
    },
  });

  // Fetch all employees or companies - global data (only once, never resets)
  useEffect(() => {
    if (hasFetchedGlobalDataRef.current || !currentUser) return;

    if (isEmployee) {
      console.log("Querying all companies inside Feed Page!!!");
      getAllCompanyStore.queryCompany();
    } else {
      console.log("Querying all employees inside Feed Page!!!");
      getAllEmployeeStore.queryEmployee();
    }

    hasFetchedGlobalDataRef.current = true;
  }, [isEmployee, currentUser, getAllCompanyStore, getAllEmployeeStore]);

  // Filter users based on role
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
    companyID: string
  ) => {
    if (!employeeID || !companyID) return;
    setLikingId(companyID);
    try {
      await employeeLikeStore.employeeLike(employeeID, companyID);
      setOpenLikeSuccessDialog(true);
      await getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(employeeID);
    } finally {
      setLikingId(null);
      getCurrentCompanyMatchingStore.queryCurrentCompanyLiked(companyID);
    }
  };

  // Handle Company Like Employee
  const handleCompanyLikeEmployee = async (
    companyID: string,
    employeeID: string
  ) => {
    if (!companyID || !employeeID) return;
    setLikingId(employeeID);
    try {
      await companyLikeStore.companyLike(companyID, employeeID);
      setOpenLikeSuccessDialog(true);
      await getCurrentCompanyLikedStore.queryCurrentCompanyLiked(companyID);
    } finally {
      setLikingId(null);
      getCurrentEmployeeMatchingStore.queryCurrentEmployeeMatching(employeeID);
    }
  };

  // Handle Employee Favorite Company
  const handleEmployeeFavoriteCompany = async (
    employeeID: string,
    companyID: string
  ) => {
    if (!employeeID || !companyID) return;
    try {
      await employeeFavCompanyStore.addCompanyToFavorite(employeeID, companyID);
      toast({
        title: "Saved",
        description: "Company added to favorites.",
      });
      await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(employeeID);
    } catch (error) {
      const err = employeeFavCompanyStore.error || "Failed to save company";
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    }
  };

  // Handle Company Favorite Employee
  const handleCompanyFavoriteEmployee = async (
    companyID: string,
    employeeID: string
  ) => {
    if (!companyID || !employeeID) return;
    try {
      await companyFavEmployeeStore.addEmployeeToFavorite(
        companyID,
        employeeID
      );
      toast({
        title: "Saved",
        description: "Employee added to favorites.",
      });
      await getAllCompanyFavoritesStore.queryAllCompanyFavorites(companyID);
    } catch (error) {
      const err = companyFavEmployeeStore.error || "Failed to save employee";
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    }
  };

  // Preload profile images for better performance
  const profileImageUrls = useMemo(() => {
    return allUsers.map((user) => user.avatar).filter(Boolean);
  }, [allUsers]);
  usePreloadImages(profileImageUrls);

  // Show loading state during hydration and initial data loading
  const showLoadingState =
    !mounted ||
    !currentUser ||
    (isEmployee &&
      (getAllCompanyStore.loading || getCurrentEmployeeLikedStore.loading)) ||
    (!isEmployee &&
      (getAllEmployeeStore.loading || getCurrentCompanyLikedStore.loading));

  return (
    <div className="w-full flex flex-col items-start gap-5">
      {/* Header Section */}
      {showLoadingState ? (
        <BannerSkeleton />
      ) : isEmployee ? (
        <div className="w-full flex items-center justify-between gap-10 tablet-xl:flex-col tablet-xl:items-center">
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
        {showLoadingState ? (
          Array.from({ length: 9 }).map((_, index) =>
            isEmployee ? (
              <CompanyCardSkeleton key={`company-skeleton-${index}`} />
            ) : (
              <EmployeeCardSkeleton key={`employee-skeleton-${index}`} />
            )
          )
        ) : allUsers.length > 0 ? (
          allUsers.map((user) =>
            isEmployee ? (
              <CompanyCard
                key={user.id}
                {...(user as ICompany)}
                id={user.id}
                onViewClick={() => {
                  router.push(`/feed/company/${user.id}`);
                }}
                onSaveClick={() => {
                  if (currentUser && currentUser.employee) {
                    const employeeID = currentUser.employee.id;
                    const companyID = user.id;
                    handleEmployeeFavoriteCompany(employeeID, companyID);
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
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.avatar ?? "");
                }}
              />
            ) : (
              <EmployeeCard
                key={user.id}
                {...(user as IEmployee)}
                id={user.id}
                onSaveClick={async () => {
                  if (currentUser && currentUser.company) {
                    const companyID = currentUser.company.id;
                    const employeeID = user.id;
                    handleCompanyFavoriteEmployee(companyID, employeeID);
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
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.avatar ?? "");
                }}
              />
            )
          )
        ) : (
          <div className="col-span-3 laptop-sm:col-span-2 tablet-lg:col-span-1 flex flex-col items-center justify-center my-16">
            <Image src={emptySvgImage} alt="empty" height={200} width={200} />
            <TypographyP className="!m-0">No user available</TypographyP>
          </div>
        )}
      </div>
      {/* Image Popup */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={currentProfileImage!}
      />
      {/* Like Success Dialog */}
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
