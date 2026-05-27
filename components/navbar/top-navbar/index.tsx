"use client";

import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { usePendingInterviewCount } from "@/hooks/utils/use-pending-interview-count";
import { useInterviewStore } from "@/stores/apis/matching/interview.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/features/chat/chat.store";
import {
  sidebarList,
  MOBILE_PRIMARY_URLS,
} from "@/utils/constants/sidebar.constant";
import { LucideFileUser, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavbarUserMenu } from "../navbar-user-menu";
import { NavbarUserMenuSkeleton } from "../skeleton";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoComponent from "@/components/utils/brand/logo";
import DesktopNavItem from "./desktop-nav-item";
import MobileTabItem from "./mobile-tab-item";
import MoreSheetItem from "./more-sheet-item";

export default function TopNavbar() {
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);
  const [moreOpen, setMoreOpen] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const { user, loading } = useGetCurrentUserStore();

  // Count Current User Matching
  const { countCurrentEmpMatching, totalEmpMatching, seenEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCmpMatching, totalCmpMatching, seenCmpMatching } =
    useCountCurrentCompanyMatchingStore();

  // Count Current User Favorites
  const { countCurrentEmpFavorites, totalEmpFavorites } =
    useCountCurrentEmployeeFavoritesStore();
  const { countCurrentCmpFavorites, totalCmpFavorites } =
    useCountCurrentCompanyFavoritesStore();

  // Count Unread Notification
  const { unreadCount: unreadNotifications, queryUnreadCount } =
    useNotificationStore();

  // Count Unread Message
  const unreadMessages = useChatStore((s) => s.unreadCount);

  // Pending Interview Count
  const pendingInterviewCount = usePendingInterviewCount();
  const queryInterviews = useInterviewStore((s) => s.queryInterviews);

  /* --------------------------------- Effects --------------------------------- */
  // Fetch Current User
  const { isEmployee, isCompany } = useFetchOnce({
    cacheKey: "navbar-component",
    onEmployeeFetch: (id) => {
      countCurrentEmpMatching(id);
      countCurrentEmpFavorites(id);
      queryInterviews(id, "employee");
    },
    onCompanyFetch: (id) => {
      countCurrentCmpMatching(id);
      countCurrentCmpFavorites(id);
      queryInterviews(id, "company");
    },
  });
  // Fetch Unread Notification
  useEffect(() => {
    void queryUnreadCount();
  }, [queryUnreadCount]);

  // Set Mounted
  useEffect(() => setMounted(true), []);

  /* --------------------------------- Methods --------------------------------- */
  // ── Matching Count ─────────────────────────────────────────────────────
  const matchingCount = useMemo(() => {
    if (isEmployee)
      return Math.max(0, (totalEmpMatching ?? 0) - seenEmpMatching);
    if (isCompany)
      return Math.max(0, (totalCmpMatching ?? 0) - seenCmpMatching);
    return 0;
  }, [
    isEmployee,
    isCompany,
    totalEmpMatching,
    seenEmpMatching,
    totalCmpMatching,
    seenCmpMatching,
  ]);

  // ── Favorite Count ─────────────────────────────────────────────────────
  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalEmpFavorites ?? 0;
    if (isCompany) return totalCmpFavorites ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpFavorites, totalCmpFavorites]);

  // ── User Data ──────────────────────────────────────────────────────────
  const userData = useMemo(() => {
    if (isEmployee && user?.employee)
      return {
        name: user.employee.username ?? "",
        email: user.email ?? user.phone ?? "",
        avatar: user.employee.avatar ?? "",
      };
    if (isCompany && user?.company)
      return {
        name: user.company.name ?? "",
        email: user.email ?? user.phone ?? "",
        avatar: user.company.avatar ?? "",
      };
    return { name: "", email: "", avatar: "" };
  }, [isEmployee, isCompany, user]);

  // ── Get Badge Count ───────────────────────────────────────────────────
  const getBadgeCount = useCallback(
    (url: string) => {
      if (url === "/matching") return matchingCount;
      if (url === "/favorite") return favoriteCount;
      if (url === "/message") return unreadMessages;
      if (url === "/notification") return unreadNotifications;
      if (url === "/interview") return pendingInterviewCount;
      return 0;
    },
    [
      matchingCount,
      favoriteCount,
      unreadMessages,
      unreadNotifications,
      pendingInterviewCount,
    ],
  );

  // ── Check Path Active ─────────────────────────────────────────────────
  const isActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  // ── Resolve URL ───────────────────────────────────────────────────────
  const resolveUrl = useCallback(
    (url: string) => (url === "/search" ? `/search/${user?.role ?? ""}` : url),
    [user?.role],
  );

  // ── Navbar Title Map ──────────────────────────────────────────────────
  const navbarTitleMap = useMemo<Record<string, string>>(
    () => ({
      Dashboard: t("dashboard"),
      Feed: t("feed"),
      Search: t("search"),
      Favorite: t("favorite"),
      Matching: t("matching"),
      Interview: t("interview"),
      Message: t("message"),
      Notification: t("notification"),
    }),
    [t],
  );

  // ── Get Navbar Title ──────────────────────────────────────────────────
  const getNavbarTitle = useCallback(
    (key: string) => navbarTitleMap[key] ?? key,
    [navbarTitleMap],
  );

  // ── Nav Item Sets ─────────────────────────────────────────────────────
  const mobilePrimaryItems = sidebarList.filter((i) =>
    MOBILE_PRIMARY_URLS.includes(i.url),
  );
  const moreItems = sidebarList.filter(
    (i) => !MOBILE_PRIMARY_URLS.includes(i.url),
  );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Sticky Top Navbar Section */}
      <nav className="sticky top-0 z-50 w-full">
        <div className="border-b border-border/40 bg-background/85 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border)/0.3),0_4px_24px_hsl(var(--foreground)/0.05)]">
          <div
            className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 lg:px-6"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* Logo Section */}
            <Link
              href="/feed"
              prefetch={true}
              className="flex shrink-0 items-center rounded-lg px-2 py-1.5 transition-colors hover:bg-accent"
            >
              <LogoComponent
                withoutTitle
                priority
                height={36}
                width={36}
                className="h-9 w-auto"
              />
            </Link>

            {/* Desktop Navigation Section */}
            <div className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
              {sidebarList.map((item) => (
                <DesktopNavItem
                  key={item.url}
                  href={resolveUrl(item.url)}
                  icon={item.icon}
                  label={getNavbarTitle(item.title)}
                  count={getBadgeCount(item.url)}
                  active={isActive(item.url)}
                />
              ))}
              {mounted && isEmployee && (
                <DesktopNavItem
                  href="/resume-builder"
                  icon={LucideFileUser}
                  label={t("aiResumeBuilder")}
                  count={0}
                  active={isActive("/resume-builder")}
                />
              )}
            </div>

            {/* Right Section: User Menu */}
            <div className="flex shrink-0 items-center gap-1">
              {loading || !user ? (
                <NavbarUserMenuSkeleton />
              ) : (
                <NavbarUserMenu user={userData} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar Section */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/85 backdrop-blur-xl shadow-[0_-1px_0_hsl(var(--border)/0.3),0_-4px_24px_hsl(var(--foreground)/0.05)] lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch justify-around">
          {mobilePrimaryItems.map((item) => (
            <MobileTabItem
              key={item.url}
              href={resolveUrl(item.url)}
              icon={item.icon}
              label={getNavbarTitle(item.title)}
              count={getBadgeCount(item.url)}
              active={isActive(item.url)}
            />
          ))}

          {/* More Sheet Section */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2">
                <span className="flex flex-col items-center gap-0.5">
                  <span className="flex h-7 w-7 items-center justify-center">
                    <MoreHorizontal
                      className="size-5 text-muted-foreground"
                      strokeWidth={1.7}
                    />
                  </span>
                  <span className="text-[10px] font-medium leading-none text-muted-foreground">
                    {t("more")}
                  </span>
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <SheetTitle className="mb-5 text-base font-bold">
                {t("more")}
              </SheetTitle>
              <div className="grid grid-cols-3 gap-3 pb-4">
                {moreItems.map((item) => (
                  <MoreSheetItem
                    key={item.url}
                    href={resolveUrl(item.url)}
                    icon={item.icon}
                    label={getNavbarTitle(item.title)}
                    count={getBadgeCount(item.url)}
                    active={isActive(item.url)}
                    onClick={() => setMoreOpen(false)}
                  />
                ))}
                {mounted && isEmployee && (
                  <MoreSheetItem
                    href="/resume-builder"
                    icon={LucideFileUser}
                    label={t("aiResumeBuilder")}
                    count={0}
                    active={isActive("/resume-builder")}
                    onClick={() => setMoreOpen(false)}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
