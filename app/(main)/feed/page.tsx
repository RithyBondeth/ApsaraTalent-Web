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
import ImagePopup from "@/components/utils/image-popup";
import { useGetAllUsersStore } from "@/stores/apis/users/get-all-user.store";
import EmployeeCardSkeleton from "@/components/employee/employee-card/skeleton";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import {
  useLocalLoginStore,
  useLoginStore,
  useSessionLoginStore,
} from "@/stores/apis/auth/login.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import CompanyCardSkeleton from "@/components/company/company-card/skeleton";

export default function FeedPage() {
  // Utils
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  // Theme
  const { resolvedTheme } = useTheme();
  const currentTheme = mounted ? resolvedTheme : "light";
  const feedImage = currentTheme === "dark" ? feedBlackSvg : feedWhiteSvg;

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
  const { users, getAllUsers } = useGetAllUsersStore();
  const accessToken = useLoginStore((state) => state.accessToken);

  const currentUserRole = getCurrentUserStore.user?.role;
  let allUsers: IUser[] = [];

  if (currentUserRole === "employee") {
    allUsers = users?.filter((user) => user.role === "employee") || [];
  } else {
    allUsers = users?.filter((user) => user.role === "company") || [];
  }

  useEffect(() => {
    if (accessToken) {
      getAllUsers(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    const local = useLocalLoginStore.getState();
    const session = useSessionLoginStore.getState();
    const source = local.accessToken ? local : session;

    if (source.accessToken) {
      useLoginStore.setState({
        accessToken: source.accessToken,
        refreshToken: source.refreshToken,
        message: source.message,
        rememberMe: source === local,
      });

      // Initial fetch
      getCurrentUserStore.getCurrentUser(source.accessToken);
    }

    // Subscribe to accessToken changes
    const unsub = useLoginStore.subscribe((state) => {
      if (state.accessToken) {
        getCurrentUserStore.getCurrentUser(state.accessToken);
      }
    });

    return () => unsub(); // Cleanup on unmount
  }, [getCurrentUserStore.getCurrentUser]);

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
        {getCurrentUserStore.loading || !users ? (
          Array.from({ length: 6 }).map((_, index) => (
            currentUserRole === "employee" ? (
              <EmployeeCardSkeleton key={`user-skeleton-${index}`} />
            ) : (
              <CompanyCardSkeleton key={`company-skeleton-${index}`} />
            )
          ))
        ) : allUsers.length > 0 ? (
          allUsers.map((user) =>
            currentUserRole === "company" && user.company ? (
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
