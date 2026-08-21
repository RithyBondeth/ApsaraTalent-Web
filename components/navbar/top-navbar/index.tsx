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
import { USER_ROLE } from "@/utils/constants/auth.constant";

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
  // ── Fetch Current User ───────────────────────
  const { isEmployee, isCompany } = useFetchOnce({
    cacheKey: "navbar-component",
    onEmployeeFetch: (id) => {
      countCurrentEmpMatching(id);
      countCurrentEmpFavorites(id);
      queryInterviews(id, USER_ROLE.EMPLOYEE);
    },
    onCompanyFetch: (id) => {
      countCurrentCmpMatching(id);
      countCurrentCmpFavorites(id);
      queryInterviews(id, USER_ROLE.COMPANY);
    },
  });

  // ── Fetch Unread Notification ────────────────
  useEffect(() => {
    if (user) void queryUnreadCount();
  }, [queryUnreadCount, user]);

  // ── Set Mounted ──────────────────────────────
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

  // ──── Is More Active ──────────────────────────────────────────────────
  const isMoreActive =
    moreItems.some((item) => isActive(item.url)) ||
    (isEmployee && isActive("/resume-builder"));

  // ──── More Badge Count ────────────────────────────────────────────────
  const moreBadgeCount = moreItems.reduce(
    (total, item) => total + getBadgeCount(item.url),
    0,
  );

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Sticky Top Navbar Section */}
      <nav
        aria-label={`${t("navigationGroup")} — Apsara Talent`}
        className="sticky top-0 z-50 w-full"
      >
        <div className="app-top-navbar bg-background/92 relative border-b border-border backdrop-blur-xl">
          <div
            className="relative mx-auto flex h-[60px] max-w-screen-2xl items-center justify-between px-3 sm:px-4 lg:h-16 lg:px-5"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* Logo Section */}
            <Link
              href="/feed"
              prefetch={true}
              aria-label="Apsara Talent"
              className="group flex h-full shrink-0 items-center border-x border-transparent px-1 transition-colors hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-2 lg:min-w-[96px] lg:justify-center"
            >
              {/* The box now follows the mark's own 187.92:120 ratio — at
                  80x48 it was 6% wide, so the logo was being stretched as
                  well as sitting small in a 60/64px bar. */}
              <LogoComponent
                priority
                height={56}
                width={88}
                className="h-12 w-[75px] transition-transform duration-300 group-hover:-translate-y-0.5 lg:h-14 lg:w-[88px]"
              />
            </Link>

            {/* Desktop Navigation Section */}
            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 px-3 lg:flex">
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
            <div className="flex shrink-0 items-center border-l border-border/70 pl-2 lg:min-w-[156px] lg:justify-end">
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
      <nav
        aria-label={t("navigationGroup")}
        className="app-mobile-navbar bg-background/94 fixed bottom-0 left-0 right-0 z-50 border-t border-border backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-[68px] max-w-xl items-stretch justify-around">
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
              <button
                aria-label={t("more")}
                className="group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-0 h-[3px] -translate-x-1/2 bg-foreground transition-[width,opacity] duration-200 ${isMoreActive ? "w-8 opacity-100" : "w-0 opacity-0"}`}
                />
                <span className="flex flex-col items-center gap-1">
                  <span
                    className={`relative flex h-8 w-9 items-center justify-center border transition-[background-color,border-color,color,transform] duration-200 ${
                      isMoreActive
                        ? "border-primary bg-primary text-primary-foreground shadow-hard-primary-xs"
                        : "border-transparent group-hover:border-border group-hover:bg-muted/60 group-active:translate-y-px"
                    }`}
                  >
                    <MoreHorizontal
                      className="size-[18px]"
                      strokeWidth={isMoreActive ? 2.3 : 1.7}
                    />
                    <span className="sr-only">{t("more")}</span>
                    {moreBadgeCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center border border-background bg-destructive px-1 text-[9px] font-extrabold leading-none text-destructive-foreground shadow-hard-xs">
                        {moreBadgeCount > 99 ? "99+" : moreBadgeCount}
                      </span>
                    )}
                  </span>
                  <span
                    className={`max-w-[4.5rem] truncate text-[10px] leading-none ${
                      isMoreActive
                        ? "font-bold text-foreground"
                        : "font-medium text-muted-foreground"
                    }`}
                  >
                    {t("more")}
                  </span>
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[76dvh] overflow-y-auto border-t border-foreground/20 p-0 [&>button]:rounded-none [&>button]:border [&>button]:border-border [&>button]:p-2"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <div className="border-b border-border px-5 py-4 pr-14">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Apsara Talent
                </p>
                <SheetTitle className="text-lg font-bold tracking-tight">
                  {t("navigationGroup")}
                </SheetTitle>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 sm:p-4">
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
      </nav>
    </>
  );
}
