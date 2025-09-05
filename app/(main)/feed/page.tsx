"use client";

import EmployeeCard from "@/components/employee/employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import feedCompanySvg from "@/assets/svg/feed-company.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React, { useMemo, useRef, useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useRouter } from "next/navigation";
import CompanyCard from "@/components/company/company-card";
import ImagePopup from "@/components/utils/image-popup";
import { useGetAllUsersStore } from "@/stores/apis/users/get-all-user.store";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
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
  const getCurrentUserStore = useGetCurrentUserStore();
  const getAllUsersStore = useGetAllUsersStore();
  const employeeLikeStore = useEmployeeLikeStore();
  const companyLikeStore = useCompanyLikeStore();
  const employeeFavCompanyStore = useEmployeeFavCompanyStore();
  const companyFavEmployeeStore = useCompanyFavEmployeeStore();
  const getAllEmployeeFavoritesStore = useGetAllEmployeeFavoritesStore();
  const getAllCompanyFavoritesStore = useGetAllCompanyFavoritesStore();
  const getCurrentEmployeeLikedStore = useGetCurrentEmployeeLikedStore();
  const getCurrentCompanyLikedStore = useGetCurrentCompanyLikedStore();

  const currentUser = useGetCurrentUserStore((state) => state.user);
  const isEmployee = currentUser?.role === "employee";

  const [likingId, setLikingId] = useState<string | null>(null);
  const [savedCompanyIds, setSavedCompanyIds] = useState<Set<string>>(
    new Set()
  );
  const [savedEmployeeIds, setSavedEmployeeIds] = useState<Set<string>>(
    new Set()
  );

  const currentUserRole = getCurrentUserStore.user?.role;
  let allUsers: IUser[] = [];

  if (currentUserRole === "employee") {
    allUsers =
      getAllUsersStore.users?.filter((user) => user.role === "company") || [];
    // Filter out already liked companies
    const currentEmployeeLikedStore =
      getCurrentEmployeeLikedStore.currentEmployeeLiked;
    if (currentEmployeeLikedStore) {
      allUsers = allUsers.filter((user) => {
        const companyId = user.company?.id;
        return (
          companyId &&
          !currentEmployeeLikedStore.some((liked) => liked.id === companyId)
        );
      });
    }
  } else {
    allUsers =
      getAllUsersStore.users?.filter((user) => user.role === "employee") || [];
    // Filter out already liked employees
    const currentCompanyLikedStore =
      getCurrentCompanyLikedStore.currentCompanyLiked;
    if (currentCompanyLikedStore) {
      allUsers = allUsers.filter((user) => {
        const employeeId = user.employee?.id;
        return (
          employeeId &&
          !currentCompanyLikedStore.some((liked) => liked.id === employeeId)
        );
      });
    }
  }

  useEffect(() => {
    // Only fetch if data is not already loaded (from login page preload)
    if (!getCurrentUserStore.user) {
      getCurrentUserStore.getCurrentUser();
    }
    if (!getAllUsersStore.users || getAllUsersStore.users.length === 0) {
      getAllUsersStore.getAllUsers();
    }
  }, []);


  useEffect(() => {
    if (currentUser && currentUser.employee && isEmployee) {
      // Only fetch if not already loaded from login preload
      if (!getCurrentEmployeeLikedStore.currentEmployeeLiked) {
        getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(
          currentUser.employee.id
        );
      }
      if (
        !getAllEmployeeFavoritesStore.companyData ||
        getAllEmployeeFavoritesStore.companyData.length === 0
      ) {
        getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
          currentUser.employee.id
        );
      }
    }
    if (currentUser && currentUser.company && !isEmployee) {
      // Only fetch if not already loaded from login preload
      if (!getCurrentCompanyLikedStore.currentCompanyLiked) {
        getCurrentCompanyLikedStore.queryCurrentCompanyLiked(
          currentUser.company.id
        );
      }
      if (
        !getAllCompanyFavoritesStore.employeeData ||
        getAllCompanyFavoritesStore.employeeData.length === 0
      ) {
        getAllCompanyFavoritesStore.queryAllCompanyFavorites(
          currentUser.company.id
        );
      }
    }
  }, [currentUser, isEmployee]);

  const favoritedCompanyIds = useMemo(() => {
    const ids =
      getAllEmployeeFavoritesStore.companyData?.map((fav) => fav.company.id) ??
      [];
    return new Set(ids);
  }, [getAllEmployeeFavoritesStore.companyData]);

  const favoritedEmployeeIds = useMemo(() => {
    const ids =
      getAllCompanyFavoritesStore.employeeData?.map((fav) => fav.employee.id) ??
      [];
    return new Set(ids);
  }, [getAllCompanyFavoritesStore.employeeData]);

  // Preload profile images for better performance
  const profileImageUrls = useMemo(() => {
    return allUsers
      .map((user) =>
        currentUserRole === "employee"
          ? user.company?.avatar
          : user.employee?.avatar
      )
      .filter(Boolean);
  }, [allUsers, currentUserRole]);

  usePreloadImages(profileImageUrls);

  // Show loading state during hydration and initial data loading
  const showLoadingState =
    !mounted ||
    getCurrentUserStore.loading ||
    getAllUsersStore.loading ||
    !getAllUsersStore.users ||
    !getCurrentUserStore.user ||
    (isEmployee && getCurrentEmployeeLikedStore.loading) ||
    (!isEmployee && getCurrentCompanyLikedStore.loading);

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
            currentUserRole === "company" ? (
              <EmployeeCardSkeleton key={`user-skeleton-${index}`} />
            ) : (
              <CompanyCardSkeleton key={`company-skeleton-${index}`} />
            )
          )
        ) : allUsers.length > 0 ? (
          allUsers.map((user) =>
            currentUserRole === "employee" && user.company ? (
              <CompanyCard
                key={user.id}
                {...user.company}
                id={user.id}
                onViewClick={() => {
                  console.log("Company -> User ID: ", user.id);
                  router.push(`/feed/company/${user.id}`)
                }}
                onSaveClick={async () => {
                  const employeeId = currentUser?.employee?.id;
                  const companyId = user.company?.id;
                  if (!employeeId || !companyId) return;
                  try {
                    await employeeFavCompanyStore.addCompanyToFavorite(
                      employeeId,
                      companyId
                    );
                    toast({
                      title: "Saved",
                      description: "Company added to favorites.",
                    });
                    setSavedCompanyIds((prev) => new Set(prev).add(user.id));
                    // Refresh favorites to persist hidden state across reloads
                    await getAllEmployeeFavoritesStore.queryAllEmployeeFavorites(
                      employeeId
                    );
                  } catch {
                    const err =
                      employeeFavCompanyStore.error || "Failed to save company";
                    toast({
                      title: "Error",
                      description: err,
                      variant: "destructive",
                    });
                  }
                }}
                hideSaveButton={
                  savedCompanyIds.has(user.id) ||
                  (!!user.company?.id &&
                    favoritedCompanyIds.has(user.company.id))
                }
                onLikeClick={async () => {
                  const empID = currentUser?.employee?.id;
                  const cmpID = user.company?.id;
                  setLikingId(user.id);
                  try {
                    await employeeLikeStore.employeeLike(
                      empID ?? "",
                      cmpID ?? ""
                    );
                    setOpenLikeSuccessDialog(true);
                    if (empID) {
                      await getCurrentEmployeeLikedStore.queryCurrentEmployeeLiked(
                        empID
                      );
                    }
                  } finally {
                    setLikingId(null);
                  }
                }}
                onLikeClickDisable={
                  user.id === likingId && employeeLikeStore.loading
                }
                onProfileImageClick={(e: React.MouseEvent) => {
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.company?.avatar ?? "");
                }}
              />
            ) : user.employee ? (
              <EmployeeCard
                key={user.id}
                {...user.employee}
                id={user.id}
                onSaveClick={async () => {
                  const companyId = currentUser?.company?.id;
                  const employeeId = user.employee?.id;
                  if (!companyId || !employeeId) return;
                  try {
                    await companyFavEmployeeStore.addEmployeeToFavorite(
                      companyId,
                      employeeId
                    );
                    toast({
                      title: "Saved",
                      description: "Employee added to favorites.",
                    });
                    setSavedEmployeeIds((prev) => new Set(prev).add(user.id));
                    // Refresh favorites to persist hidden state across reloads
                    await getAllCompanyFavoritesStore.queryAllCompanyFavorites(
                      companyId
                    );
                  } catch {
                    const err =
                      companyFavEmployeeStore.error ||
                      "Failed to save employee";
                    toast({
                      title: "Error",
                      description: err,
                      variant: "destructive",
                    });
                  }
                }}
                hideSaveButton={
                  savedEmployeeIds.has(user.id) ||
                  (!!user.employee?.id &&
                    favoritedEmployeeIds.has(user.employee.id))
                }
                onViewClick={() => router.push(`/feed/employee/${user.id}`)}
                onLikeClick={async () => {
                  const cmpID = currentUser?.company?.id;
                  const empID = user.employee?.id;
                  setLikingId(user.id);
                  try {
                    await companyLikeStore.companyLike(
                      cmpID ?? "",
                      empID ?? ""
                    );
                    setOpenLikeSuccessDialog(true);
                    if (cmpID) {
                      await getCurrentCompanyLikedStore.queryCurrentCompanyLiked(
                        cmpID
                      );
                    }
                  } finally {
                    setLikingId(null);
                  }
                }}
                onLikeClickDisable={
                  user.id === likingId && companyLikeStore.loading
                }
                onProfileImageClick={(e: React.MouseEvent) => {
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.employee?.avatar ?? "");
                }}
              />
            ) : null
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
