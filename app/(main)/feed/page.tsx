"use client";

import EmployeeCard from "@/components/employee/employee-card";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import Image from "next/image";
import feedBlackSvg from "@/assets/svg/feed-black.svg";
import feedWhiteSvg from "@/assets/svg/feed-white.svg";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { useRouter } from "next/navigation";
import CompanyCard from "@/components/company/company-card";
import { userList } from "@/data/user-data";
import ImagePopup from "@/components/utils/image-popup";
import { useGetAllUsersStore } from "@/stores/apis/users/get-all-user.store";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLocalLoginStore, useLoginStore, useSessionLoginStore } from "@/stores/apis/auth/login.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";

export default function FeedPage() {

  // Utils
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() =>  setMounted(true), []);

  // Theme 
  const { resolvedTheme } = useTheme();
  const currentTheme = mounted ? resolvedTheme : "light";
  const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;

  // Showing Employee or Company
  const companyList = userList.filter((user) => user.role === "company");
  const employeeList = userList.filter((user) => user.role === "employee");

  // Pop up Dialog
  const [openProfilePopup, setOpenProfilePopup] = useState<boolean>(false);
  const ignoreNextClick = useRef<boolean>(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null);

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
  const { users, getAllUsers } = useGetAllUsersStore();
  
  const currentUserRole = getCurrentUserStore.user?.role;
  let allUsers: IUser[] = [];

  if (currentUserRole === 'employee') {
    allUsers = users?.filter((user) => user.role === 'employee') || [];
  } else {
    allUsers = users?.filter((user) => user.role === 'company') || [];
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const local = useLocalLoginStore.getState();
    const session = useSessionLoginStore.getState();
    const source = local.accessToken ? local : session;
  
    if (source.accessToken) {
      // Rehydrate login state
      useLoginStore.setState({
        accessToken: source.accessToken,
        refreshToken: source.refreshToken,
        message: source.message,
        rememberMe: source === local,
      });
  
      // Fetch current user
      getCurrentUserStore.getCurrentUser(source.accessToken);
    }
  }, []);

  return (
    <div className="w-full flex flex-col items-start gap-5">
      {/* Header Section */}
      <div className="w-full flex items-start justify-between gap-5 tablet-xl:flex-col tablet-xl:items-center">
        <div className="flex flex-col items-start gap-3 tablet-xl:w-full tablet-xl:items-center">
          <TypographyH2 className="leading-relaxed tablet-xl:text-center">
            Apply to your favorite jobs from anywhere.
          </TypographyH2>
          <TypographyH4 className="leading-relaxed tablet-xl:text-center">
            Connect with professionals around the world.
          </TypographyH4>
          <TypographyMuted className="leading-relaxed tablet-xl:text-center">
            Find your dream job with ease and apply to it from anywhere.
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

      {/* Feed Card Section */}
      <div className="w-full grid grid-cols-2 gap-5 tablet-lg:grid-cols-1">
        {/* {companyList.map((user) => (
          <CompanyCard
            key={user.id}
            {...user.company!}
            onViewClick={() => router.push(`feed/company/${user.company?.id}`)}
            onSaveClick={() => {}}
            onProfileImageClick={(e: React.MouseEvent) => {
              handleClickProfilePopup(e);
              setCurrentProfileImage(user.company?.avatar!);
            }}
          />
        ))} */}
        {(allUsers && allUsers.length > 0) ? allUsers.map((user) => (
          <EmployeeCard
            key={user.id}
            {...user.employee!}
            onSaveClick={() => {}}
            onViewClick={() =>
              router.push(`/feed/employee/${user.id}`)
            }
            onProfileImageClick={(e: React.MouseEvent) => {
              handleClickProfilePopup(e);
              setCurrentProfileImage(user.employee?.avatar!);
            }}
          />
        )) : (
          Array.from({ length: 5 }).map((_, index) => <EmployeeCardSkeleton key={index}/>) 
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
