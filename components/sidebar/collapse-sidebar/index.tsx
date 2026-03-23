"use client";
import { Separator } from "@/components/ui/separator";
import { useFetchOnce } from "@/hooks/utils/use-fetch-once";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/features/chat.store";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { LucideFileUser } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect, useMemo } from "react";
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
import LogoComponent from "../../utils/logo";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { SidebarDropdownFooterSkeleton } from "./sidebar-dropdown-footer/skeleton";

/* ── Inline badge shown next to menu text when sidebar is open ── */
const CountBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-none text-destructive-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
};

/* ── Shared className for every SidebarMenuButton ── */
const MENU_BTN_CLS = [
  "group-data-[collapsible=icon]:justify-center",
  "font-medium",
  "px-2.5 py-2.5",
  "text-[15px] md:text-sm",
  "transition-all duration-300 ease-out",
  /* active */
  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
  "data-[active=true]:shadow-[0_4px_14px_hsl(var(--primary)/0.35)]",
  "data-[active=true]:animate-sidebar-active-in",
  /* lock active style on hover */
  "hover:data-[active=true]:bg-primary hover:data-[active=true]:text-primary-foreground",
].join(" ");

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  /* ── Utils ─────────────────────────────────── */
  const pathname = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const t = useTranslations("sidebar");
  const isExpanded = isMobile ? true : open;

  const sidebarTitleMap = useMemo<Record<string, string>>(
    () => ({
      Feed: t("feed"),
      Search: t("search"),
      Favorite: t("favorite"),
      Matching: t("matching"),
      Message: t("message"),
      Notification: t("notification"),
    }),
    [t],
  );

  const getSidebarTitle = useCallback(
    (title: string): string => sidebarTitleMap[title] ?? title,
    [sidebarTitleMap],
  );

  /* ── API ────────────────────────────────────── */
  const { user, loading } = useGetCurrentUserStore();
  const { countCurrentEmployeeMatching, totalEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCompanyMatching, totalCmpMatching } =
    useCountCurrentCompanyMatchingStore();
  const { totalAllEmployeeFavorites, countAllEmployeeFavorites } =
    useCountAllEmployeeFavoritesStore();
  const { totalAllCompanyFavorites, countAllCompanyFavorites } =
    useCountAllCompanyFavoritesStore();
  const { unreadCount: unreadNotifications, fetchUnreadCount } =
    useNotificationStore();
  const unreadMessages = useChatStore((s) => s.unreadCount);

  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  const { isEmployee, isCompany } = useFetchOnce({
    cacheKey: "sidebar-component",
    onEmployeeFetch: (employeeId) => {
      countCurrentEmployeeMatching(employeeId);
      countAllEmployeeFavorites(employeeId);
    },
    onCompanyFetch: (companyId) => {
      countCurrentCompanyMatching(companyId);
      countAllCompanyFavorites(companyId);
    },
  });

  /* ── Derived counts ─────────────────────────── */
  const matchingCount = useMemo(() => {
    if (isEmployee) return totalEmpMatching ?? 0;
    if (isCompany) return totalCmpMatching ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpMatching, totalCmpMatching]);

  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalAllEmployeeFavorites ?? 0;
    if (isCompany) return totalAllCompanyFavorites ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalAllEmployeeFavorites, totalAllCompanyFavorites]);

  const userData = useMemo(
    (): { name: string; email: string; avatar: string } => {
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
    },
    [isEmployee, isCompany, user],
  );

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

  const isPathActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  const resolveUrl = useCallback(
    (url: string) => (url === "/search" ? `/search/${user?.role ?? ""}` : url),
    [user?.role],
  );

  const handleNavClick = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  /* ── Shared nav item renderer ─────────────── */
  const renderNavItem = (
    url: string,
    title: string,
    Icon: React.ElementType,
    badgeCount?: number,
  ) => {
    const count = badgeCount ?? getBadgeCount(url);
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
              isActive={isPathActive(url)}
              tooltip={title}
              className={MENU_BTN_CLS}
              asChild
            >
              <Link href={resolveUrl(url)} prefetch={true} onClick={handleNavClick}>
                <Icon className="!size-5 shrink-0" strokeWidth={1.5} />
                <span className="group-data-[collapsible=icon]:hidden">{title}</span>
                {isExpanded && count > 0 && (
                  <span className="group-data-[collapsible=icon]:hidden">
                    <CountBadge count={count} />
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {/* Floating badge visible only when sidebar is collapsed */}
          {!isExpanded && count > 0 && (
            <span className="pointer-events-none absolute -top-1.5 right-1 z-50 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  /* ── Render ─────────────────────────────────── */
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Header / Logo ── */}
      <SidebarHeader className="pb-3">
        <Link href="/feed" className="flex items-center">
          {isExpanded ? (
            <LogoComponent priority={true} />
          ) : (
            <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
              <LogoComponent withoutTitle />
            </SidebarMenuButton>
          )}
        </Link>
      </SidebarHeader>

      <Separator className="mb-1" />

      {/* ── Navigation Items ── */}
      <SidebarContent className="pb-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {sidebarList.map((item) =>
              renderNavItem(item.url, getSidebarTitle(item.title), item.icon),
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* ── Tools (employees only) ── */}
        {!isCompany && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
              Tools
            </SidebarGroupLabel>
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

      <Separator />

      {/* ── Footer / User menu ── */}
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
