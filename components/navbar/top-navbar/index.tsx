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
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { LucideFileUser, MoreHorizontal, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NavbarUserMenu, NavbarUserMenuSkeleton } from "./navbar-user-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoComponent from "@/components/utils/brand/logo";

/* ─────────────────────────────────────────────────────────────────────
   Mobile bottom bar shows these 5 routes; the rest go in "More" sheet
   ───────────────────────────────────────────────────────────────────── */
const MOBILE_PRIMARY_URLS = [
  "/feed",
  "/matching",
  "/message",
  "/notification",
  "/dashboard",
];

/* ─────────────────────────────────────────────────────────────────────
   Badge pill — amber on dark (desktop) or on white (mobile)
   ───────────────────────────────────────────────────────────────────── */
function BadgePill({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background leading-none animate-nav-badge-pulse">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Desktop nav item
   ───────────────────────────────────────────────────────────────────── */
function DesktopNavItem({
  href,
  icon: Icon,
  label,
  count,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={[
        "group relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-2",
        "text-xs font-medium transition-colors duration-150",
        active
          ? "bg-accent text-foreground animate-navbar-active-in"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      ].join(" ")}
    >
      <span className="relative">
        <Icon
          className="size-[18px] shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110"
          strokeWidth={active ? 2.2 : 1.6}
        />
        <BadgePill count={count} />
      </span>
      {/* Hover tooltip */}
      <span className="pointer-events-none absolute top-full left-1/2 mt-1.5 -translate-x-1/2 z-50 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0">
        {label}
      </span>
      {/* Active indicator line */}
      {active && (
        <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-foreground/70 animate-nav-indicator-in" />
      )}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Mobile bottom tab item
   ───────────────────────────────────────────────────────────────────── */
function MobileTabItem({
  href,
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
    >
      <span className="relative">
        <Icon
          className={`size-5 transition-colors duration-200 ${active ? "text-primary animate-nav-tab-bounce" : "text-muted-foreground"}`}
          strokeWidth={active ? 2.3 : 1.7}
        />
        <BadgePill count={count} />
      </span>
      <span
        className={`text-[10px] font-medium leading-none transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   More-sheet grid item
   ───────────────────────────────────────────────────────────────────── */
function MoreSheetItem({
  href,
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={true}
      onClick={onClick}
      className={[
        "flex flex-col items-center gap-2 rounded-2xl p-4 transition-all",
        active ? "bg-accent shadow-sm" : "bg-muted/50 hover:bg-muted",
      ].join(" ")}
    >
      <span className="relative">
        <Icon
          className={`size-6 ${active ? "text-primary" : "text-foreground/80"}`}
          strokeWidth={active ? 2.3 : 1.7}
        />
        <BadgePill count={count} />
      </span>
      <span
        className={`text-xs font-medium text-center ${active ? "text-primary" : "text-foreground/80"}`}
      >
        {label}
      </span>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TopNavbar — main export
   ═══════════════════════════════════════════════════════════════════ */
export default function TopNavbar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const [mounted, setMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  /* ── API stores ─────────────────────────────────────────────────── */
  const { user, loading } = useGetCurrentUserStore();
  const { countCurrentEmpMatching, totalEmpMatching, seenEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCmpMatching, totalCmpMatching, seenCmpMatching } =
    useCountCurrentCompanyMatchingStore();
  const { countCurrentEmpFavorites, totalEmpFavorites } =
    useCountCurrentEmployeeFavoritesStore();
  const { countCurrentCmpFavorites, totalCmpFavorites } =
    useCountCurrentCompanyFavoritesStore();
  const { unreadCount: unreadNotifications, queryUnreadCount } =
    useNotificationStore();
  const unreadMessages = useChatStore((s) => s.unreadCount);
  const pendingInterviewCount = usePendingInterviewCount();
  const queryInterviews = useInterviewStore((s) => s.queryInterviews);

  /* ── Fetch counts ───────────────────────────────────────────────── */
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

  useEffect(() => {
    void queryUnreadCount();
  }, [queryUnreadCount]);
  useEffect(() => setMounted(true), []);

  /* ── Derived counts ─────────────────────────────────────────────── */
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

  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalEmpFavorites ?? 0;
    if (isCompany) return totalCmpFavorites ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpFavorites, totalCmpFavorites]);

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

  /* ── Helpers ────────────────────────────────────────────────────── */
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

  const isActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  const resolveUrl = useCallback(
    (url: string) => (url === "/search" ? `/search/${user?.role ?? ""}` : url),
    [user?.role],
  );

  const titleMap = useMemo<Record<string, string>>(
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

  const getTitle = useCallback(
    (key: string) => titleMap[key] ?? key,
    [titleMap],
  );

  /* ── Nav item sets ──────────────────────────────────────────────── */
  const mobilePrimaryItems = sidebarList.filter((i) =>
    MOBILE_PRIMARY_URLS.includes(i.url),
  );
  const moreItems = sidebarList.filter(
    (i) => !MOBILE_PRIMARY_URLS.includes(i.url),
  );

  /* ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ── Sticky Top Navbar ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full">
        <div className="bg-background/95 backdrop-blur-md border-b border-border/60">
          <div
            className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* Logo — icon only (logo-without-title.svg, dark-mode aware via CSS filter) */}
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

            {/* Desktop nav items — only on lg+ (1024px) to avoid tablet overflow */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {sidebarList.map((item) => (
                <DesktopNavItem
                  key={item.url}
                  href={resolveUrl(item.url)}
                  icon={item.icon}
                  label={getTitle(item.title)}
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

            {/* User menu — always visible */}
            <div className="flex shrink-0 items-center">
              {loading || !user ? (
                <NavbarUserMenuSkeleton />
              ) : (
                <NavbarUserMenu user={userData} />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Bottom Tab Bar ─────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border/60"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-16 items-stretch justify-around">
          {mobilePrimaryItems.map((item) => (
            <MobileTabItem
              key={item.url}
              href={resolveUrl(item.url)}
              icon={item.icon}
              label={getTitle(item.title)}
              count={getBadgeCount(item.url)}
              active={isActive(item.url)}
            />
          ))}

          {/* More sheet */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2">
                <MoreHorizontal
                  className="size-5 text-muted-foreground"
                  strokeWidth={1.7}
                />
                <span className="text-[10px] font-medium leading-none text-muted-foreground">
                  More
                </span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-3xl"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <SheetTitle className="mb-5 text-base font-bold">More</SheetTitle>
              <div className="grid grid-cols-3 gap-3 pb-4">
                {moreItems.map((item) => (
                  <MoreSheetItem
                    key={item.url}
                    href={resolveUrl(item.url)}
                    icon={item.icon}
                    label={getTitle(item.title)}
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
