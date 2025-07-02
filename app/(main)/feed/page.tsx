"use client";

import EmployeeCard from "@/components/employee/employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import feedCompanySvg from "@/assets/svg/feed-company.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useRouter } from "next/navigation";
import CompanyCard from "@/components/company/company-card";
import ImagePopup from "@/components/utils/image-popup";
import { useGetAllUsersStore } from "@/stores/apis/users/get-all-user.store";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import CompanyCardSkeleton from "@/components/company/company-card/skeleton";
import { BannerSkeleton } from "./banner-skeleton";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";

export default function FeedPage() {
  // Utils
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  // Theme
  const { resolvedTheme } = useTheme();
  const currentTheme = mounted ? resolvedTheme : "light";
  const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;
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

  // API Integration
  const getCurrentUserStore = useGetCurrentUserStore();
  const getAllUsersStore = useGetAllUsersStore();
  const accessToken = useLoginStore((state) => state.accessToken);
  const otpAccessToken = useVerifyOTPStore((state) => state.accessToken);

  const currentUserRole = getCurrentUserStore.user?.role;
  let allUsers: IUser[] = [];

  if (currentUserRole === "employee") {
    allUsers = getAllUsersStore.users?.filter((user) => user.role === "company") || [];
  } else {
    allUsers = getAllUsersStore.users?.filter((user) => user.role === "employee") || [];
  }

  useEffect(() => {
    if (accessToken) {
      getCurrentUserStore.getCurrentUser(accessToken); 
      getAllUsersStore.getAllUsers(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if(otpAccessToken) {
      getCurrentUserStore.getCurrentUser(otpAccessToken);
      getAllUsersStore.getAllUsers(otpAccessToken);
    }
  }, [otpAccessToken]);

  const currentUser = useGetCurrentUserStore((state) => state.user);
  const isEmployee = currentUser?.role === 'employee';

  return (
    <div className="w-full flex flex-col items-start gap-5">
      {/* Header Section */}
      {getCurrentUserStore.loading ? (
        <BannerSkeleton/>
      ) : isEmployee ? (
        <div className="w-full flex items-center justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
          <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
            <TypographyH2 className="leading-relaxed tablet-xl:text-center">
              Connect with global professionals and grow your network
            </TypographyH2>
            <TypographyH4 className="leading-relaxed tablet-xl:text-center">
              Start your journey toward a career you love.
            </TypographyH4>
            <TypographyH4 className="leading-relaxed tablet-xl:text-center">
              Build meaningful connections that open doors to new opportunities.
            </TypographyH4>
            <TypographyMuted className="leading-relaxed tablet-xl:text-center">
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
          <Image
            src={feedImage}
            alt="feed"
            height={300}
            width={400}
            className="tablet-xl:!w-full"
          />
        </div>
      )}

      {/* Feed Card Section */}
      <div className="w-full grid grid-cols-2 gap-5 tablet-lg:grid-cols-1">
        {(getAllUsersStore.loading || !getAllUsersStore.users) ? (
          Array.from({ length: 6 }).map((_, index) => (
            currentUserRole === "company" ? (
              <EmployeeCardSkeleton key={`user-skeleton-${index}`} />
            ) : (
              <CompanyCardSkeleton key={`company-skeleton-${index}`} />
            )
          ))
        ) : allUsers.length > 0 ? (
          allUsers.map((user) =>
            currentUserRole === "employee" && user.company ? (
              <CompanyCard
                key={user.id}
                {...user.company}
                id={user.id}
                onViewClick={() => router.push(`feed/company/${user.id}`)}
                onSaveClick={() => {}}
                onProfileImageClick={(e: React.MouseEvent) => {
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.company?.avatar!);
                }}
              />
            ) : user.employee ? (
              <EmployeeCard
                key={user.id}
                {...user.employee}
                id={user.id}
                onSaveClick={() => {}}
                onViewClick={() => router.push(`/feed/employee/${user.id}`)}
                onProfileImageClick={(e: React.MouseEvent) => {
                  handleClickProfilePopup(e);
                  setCurrentProfileImage(user.employee?.avatar!);
                }}
              />
            ) : null
          )
        ) : (
          <div className="col-span-2 flex justify-center items-center py-10">
            <TypographyMuted>No users found</TypographyMuted>
          </div>
        )}
      </div>
      {/* Image Popup */}
      <ImagePopup
        open={openProfilePopup}
        setOpen={setOpenProfilePopup}
        image={currentProfileImage!}
      />
    </div>
  );
}
