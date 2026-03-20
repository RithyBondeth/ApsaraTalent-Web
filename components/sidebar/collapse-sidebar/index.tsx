"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFetchOnce } from "@/hooks/use-fetch-once";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useNotificationStore } from "@/stores/apis/notification/notification.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useChatStore } from "@/stores/chat.store";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../ui/sidebar";
import LogoComponent from "../../utils/logo";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { SidebarDropdownFooterSkeleton } from "./sidebar-dropdown-footer/skeleton";

// Badge Component
const CountBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <Badge className="bg-red-500 dark:text-primary">{count}</Badge>
  );
};

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Utils
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

  // API Calls
  const { user, loading } = useGetCurrentUserStore();
  const { countCurrentEmployeeMatching, totalEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCompanyMatching, totalCmpMatching } =
    useCountCurrentCompanyMatchingStore();
  const { totalAllEmployeeFavorites, countAllEmployeeFavorites } =
    useCountAllEmployeeFavoritesStore();
  const { totalAllCompanyFavorites, countAllCompanyFavorites } =
    useCountAllCompanyFavoritesStore();

  // Notification & message unread counts
  const { unreadCount: unreadNotifications, fetchUnreadCount } =
    useNotificationStore();
  const unreadMessages = useChatStore((s) => s.unreadCount);

  // Fetch unread notification count on mount (and keep it fresh)
  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Handles all ref logic and duplicate prevention
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

  // Memoized counts
  const matchingCount = useMemo(() => {
    if (isEmployee) return totalEmpMatching ?? 0;
    if (isCompany) return totalCmpMatching ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpMatching, totalCmpMatching]);

  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalAllEmployeeFavorites ?? 0;
    if (isCompany) return totalAllCompanyFavorites ?? 0;
    return 0;
  }, [
    isEmployee,
    isCompany,
    totalAllEmployeeFavorites,
    totalAllCompanyFavorites,
  ]);

  // Memoized user data
  const userData = useMemo((): {
    name: string;
    email: string;
    avatar: string;
  } => {
    if (isEmployee && user?.employee) {
      return {
        name: user.employee.username ?? "",
        email: user.email ?? user.phone ?? "",
        avatar: user.employee.avatar ?? "",
      };
    }

    if (isCompany && user?.company) {
      return {
        name: user.company.name ?? "",
        email: user.email ?? user.phone ?? "",
        avatar: user.company.avatar ?? "",
      };
    }

    return { name: "", email: "", avatar: "" };
  }, [isEmployee, isCompany, user]);

  // Badge count per URL
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

  // Check if a path is active
  const isPathActive = useCallback(
    (url: string) => pathname === url || pathname.startsWith(`${url}/`),
    [pathname],
  );

  // Resolve URL for search (needs role appended)
  const resolveUrl = useCallback(
    (url: string) => {
      if (url === "/search") return `/search/${user?.role ?? ""}`;
      return url;
    },
    [user?.role],
  );

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/feed">
          {isExpanded ? (
            <LogoComponent priority={true} />
          ) : (
            <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
              <LogoComponent withoutTitle />
            </SidebarMenuButton>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="pb-1">
        <SidebarGroup>
          <SidebarMenu className="space-y-1.5 md:space-y-3">
            {sidebarList.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem className="relative">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isPathActive(item.url)}
                      tooltip={item.title}
                      className="font-medium px-2.5 md:px-2 py-2.5 md:py-3 text-[15px] md:text-sm transition-all duration-300 ease-out data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-[0_8px_18px_hsl(var(--primary)/0.28)] data-[active=true]:animate-sidebar-active-in hover:data-[active=true]:bg-primary hover:data-[active=true]:text-primary-foreground"
                      asChild
                    >
                      <Link
                        href={resolveUrl(item.url)}
                        prefetch={true}
                        onClick={handleNavClick}
                      >
                        {item.icon && (
                          <item.icon
                            className="!size-5 md:!size-6 shrink-0"
                            strokeWidth={1.5}
                          />
                        )}
                        <span className="group-data-[collapsible=icon]:hidden">{getSidebarTitle(item.title)}</span>
                        {isExpanded && item.url === "/matching" && (
                          <span className="ml-auto">
                            <CountBadge count={matchingCount} />
                          </span>
                        )}
                        {isExpanded && item.url === "/favorite" && (
                          <span className="ml-auto">
                            <CountBadge count={favoriteCount} />
                          </span>
                        )}
                        {isExpanded && item.url === "/message" && (
                          <span className="ml-auto">
                            <CountBadge count={unreadMessages} />
                          </span>
                        )}
                        {isExpanded && item.url === "/notification" && (
                          <span className="ml-auto">
                            <CountBadge count={unreadNotifications} />
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isExpanded && getBadgeCount(item.url) > 0 && (
                    <span className="pointer-events-none absolute -top-1.5 right-1 z-50 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                      {getBadgeCount(item.url) > 99 ? "99+" : getBadgeCount(item.url)}
                    </span>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}

            {/* AI Resume Builder - Only for employees */}
            {!isCompany && (
              <Collapsible
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem className="relative">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isPathActive("/resume-builder")}
                      tooltip={t("aiResumeBuilder")}
                      className="font-medium px-2.5 md:px-2 py-2.5 md:py-3 text-[15px] md:text-sm transition-all duration-300 ease-out data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-[0_8px_18px_hsl(var(--primary)/0.28)] data-[active=true]:animate-sidebar-active-in hover:data-[active=true]:bg-primary hover:data-[active=true]:text-primary-foreground"
                      asChild
                    >
                      <Link
                        href="/resume-builder"
                        prefetch={true}
                        onClick={handleNavClick}
                      >
                        <LucideFileUser
                          className="!size-5 md:!size-6 shrink-0"
                          strokeWidth={1.5}
                        />
                        <span className="group-data-[collapsible=icon]:hidden">{t("aiResumeBuilder")}</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <Separator />

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
