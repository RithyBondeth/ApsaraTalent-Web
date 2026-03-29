"use client";

import { Separator } from "@/components/ui/separator";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useCountCurrentCompanyFavoritesStore } from "@/stores/apis/favorite/count-current-company-favorites.store";
import { useCountCurrentEmployeeFavoritesStore } from "@/stores/apis/favorite/count-current-employee-favorites.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/features/chat/chat.store";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { LucideFileUser } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Collapsible, CollapsibleTrigger } from "../../ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import LogoComponent from "@/components/utils/brand/logo";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { SidebarDropdownFooterSkeleton } from "../skeleton";
import FloatingBadge from "./badge/floating-badge";
import CountBadge from "./badge/count-badge";

/* ─────────────────────────────────────────────────────────────────────────
   Shared Button ClassName
   Active: Gradient fill + inset left glow accent + outer drop shadow
   Hover: 2 px slide-right micro-animation (cancelled on active items)
   ───────────────────────────────────────────────────────────────────────── */
const MENU_BTN_CLS = [
  "group-data-[collapsible=icon]:justify-center",
  "font-medium",
  "px-2.5 py-2.5",
  "text-[15px] md:text-sm",
  "transition-all duration-300 ease-out",
  /* Hover slide-right on non-active items */
  "hover:translate-x-[2px]",
  /* ── Active state ── */
  "data-[active=true]:bg-gradient-to-r",
  "data-[active=true]:from-primary",
  "data-[active=true]:to-primary/80",
  "data-[active=true]:text-primary-foreground",
  "data-[active=true]:font-semibold",
  /* Inset left accent bar + outer glow */
  "data-[active=true]:shadow-[inset_3px_0_0_hsl(var(--primary-foreground)/0.3),_0_6px_20px_hsl(var(--primary)/0.4)]",
  "data-[active=true]:animate-sidebar-active-in",
  /* Cancel slide on active */
  "data-[active=true]:translate-x-0",
  "hover:data-[active=true]:translate-x-0",
  /* Lock gradient on hover-over-active */
  "hover:data-[active=true]:bg-gradient-to-r",
  "hover:data-[active=true]:from-primary",
  "hover:data-[active=true]:to-primary/80",
  "hover:data-[active=true]:text-primary-foreground",
].join(" ");

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const t = useTranslations("sidebar");
  const isExpanded = isMobile ? true : open;

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  // Current User
  const { user, loading } = useGetCurrentUserStore();

  // Count Current User Matching
  const { countCurrentEmpMatching, totalEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCmpMatching, totalCmpMatching } =
    useCountCurrentCompanyMatchingStore();

  // Count Current User Favorites
  const { countCurrentEmpFavorites, totalEmpFavorites } =
    useCountCurrentEmployeeFavoritesStore();
  const { countCurrentCmpFavorites, totalCmpFavorites } =
    useCountCurrentCompanyFavoritesStore();

  // Count Unread Notification
  const { unreadCount: unreadNotifications, fetchUnreadCount } =
    useNotificationStore();

  // Count Unread Message
  const unreadMessages = useChatStore((s) => s.unreadCount);

  /* --------------------------------- Effects --------------------------------- */
  // Fetch Current User
  const { isEmployee, isCompany } = useFetchOnce({
    cacheKey: "sidebar-component",
    onEmployeeFetch: (employeeId) => {
      countCurrentEmpMatching(employeeId);
      countCurrentEmpFavorites(employeeId);
    },
    onCompanyFetch: (companyId) => {
      countCurrentCmpMatching(companyId);
      countCurrentCmpFavorites(companyId);
    },
  });

  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => setMounted(true), []);

  /* --------------------------------- Methods --------------------------------- */
  // ── Sidebar Title Map ──────────────────────────────────────────────────
  const sidebarTitleMap = useMemo<Record<string, string>>(
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

  // ── Get Sidebar Title ──────────────────────────────────────────────────
  const getSidebarTitle = useCallback(
    (title: string): string => sidebarTitleMap[title] ?? title,
    [sidebarTitleMap],
  );

  // ── Matching Count ─────────────────────────────────────────────────────
  const matchingCount = useMemo(() => {
    if (isEmployee) return totalEmpMatching ?? 0;
    if (isCompany) return totalCmpMatching ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpMatching, totalCmpMatching]);

  // ── Favorite Count ─────────────────────────────────────────────────────
  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalEmpFavorites ?? 0;
    if (isCompany) return totalCmpFavorites ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpFavorites, totalCmpFavorites]);

  // ── User Data ──────────────────────────────────────────────────────────
  const userData = useMemo((): {
    name: string;
    email: string;
    avatar: string;
  } => {
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

  // ── Get Badge Count ───────────────────────────────────────────────
  const getBadgeCount = useCallback(
    (url: string): number => {
      if (url === "/matching") return matchingCount;
      if (url === "/favorite") return favoriteCount;
      if (url === "/message") return unreadMessages;
      if (url === "/notification") return unreadNotifications;
      return 0;
    },
    [matchingCount, favoriteCount, unreadMessages, unreadNotifications],
  );

  // ── Check Path Active ───────────────────────────────────────────────
  const isPathActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  // ── Resolve URL ──────────────────────────────────────────────────────
  const resolveUrl = useCallback(
    (url: string) => (url === "/search" ? `/search/${user?.role ?? ""}` : url),
    [user?.role],
  );

  // ── Handle Nav Click ─────────────────────────────────────────────────
  const handleNavClick = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  // ── Render Custom Navigation Item ─────────────────────────────────────
  const renderNavItem = (
    url: string,
    title: string,
    Icon: React.ElementType,
    badgeCount?: number,
  ) => {
    const count = badgeCount ?? getBadgeCount(url);
    const active = isPathActive(url);
    return (
      <Collapsible
        key={url}
        asChild
        defaultOpen={true}
        className="group/collapsible"
      >
        <SidebarMenuItem className="relative">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              isActive={active}
              tooltip={title}
              className={MENU_BTN_CLS}
              asChild
            >
              <Link
                href={resolveUrl(url)}
                prefetch={true}
                onClick={handleNavClick}
              >
                {/* Icon Section — Bolder stroke when active for extra punch */}
                <Icon
                  className="!size-5 shrink-0 transition-all duration-300"
                  strokeWidth={active ? 2.2 : 1.5}
                />
                {/* Title Section */}
                <span className="group-data-[collapsible=icon]:hidden">
                  {title}
                </span>
                {/* Inline Badge Section (Expanded Only) */}
                {isExpanded && count > 0 && (
                  <span className="group-data-[collapsible=icon]:hidden">
                    <CountBadge count={count} />
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {/* Floating Badge Section (Collapsed Only) */}
          {!isExpanded && <FloatingBadge count={count} />}
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  /* --------------------------------------------- Render UI --------------------------------------------- */
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header Section: Logo */}
      <SidebarHeader className="pt-1 pb-3">
        {isExpanded ? (
          <Link
            href="/feed"
            className="flex items-center rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-sidebar-accent"
          >
            <LogoComponent priority={true} />
          </Link>
        ) : (
          <SidebarMenuButton
            tooltip="Apsara Talent"
            className="justify-center text-sm"
            asChild
          >
            <Link href="/feed">
              <LogoComponent withoutTitle />
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarHeader>

      {/* Separator Between Header and Navigation Section */}
      <Separator className="mb-1" />

      {/* Navigation Group Section */}
      <SidebarContent className="pb-1">
        <SidebarGroup>
          <NavGroupLabel>{t("navigationGroup")}</NavGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {sidebarList.map((item) =>
              renderNavItem(item.url, getSidebarTitle(item.title), item.icon),
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Tools Group Section: Employees Only (Deferred until after hydration) */}
        {mounted && isEmployee && (
          <SidebarGroup>
            <NavGroupLabel>{t("toolsGroup")}</NavGroupLabel>
            <SidebarMenu>
              {renderNavItem(
                "/resume-builder",
                t("aiResumeBuilder"),
                LucideFileUser,
                0,
              )}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Separator Between Tools / Navigation and Footer */}
      <Separator />

      {/* Footer / User Menu Section */}
      <SidebarFooter className="pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {loading || !user ? (
          <SidebarDropdownFooterSkeleton />
        ) : (
          <SidebarDropdownFooter user={userData} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Section Label with Coloured Dot Marker
   ───────────────────────────────────────────────────────────────────────── */
const NavGroupLabel = ({ children }: { children: React.ReactNode }) => (
  <SidebarGroupLabel className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
    {children}
  </SidebarGroupLabel>
);
