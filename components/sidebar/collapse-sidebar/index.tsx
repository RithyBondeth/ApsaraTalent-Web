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
    <Badge className="ml-auto bg-red-500 dark:text-primary">{count}</Badge>
  );
};

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Utils
  const pathname = usePathname();
  const { open } = useSidebar();
  const t = useTranslations("sidebar");

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/feed">
          {open ? (
            <LogoComponent priority={true} />
          ) : (
            <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
              <LogoComponent withoutTitle />
            </SidebarMenuButton>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-5">
            {sidebarList.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`font-medium py-3 ${
                        isPathActive(item.url)
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      asChild
                    >
                      <Link href={resolveUrl(item.url)} prefetch={true}>
                        {item.icon && (
                          <span className="relative shrink-0">
                            <item.icon
                              className="!size-6 group-data-[collapsible=icon]:pr-1"
                              strokeWidth={1.5}
                            />
                            {!open && getBadgeCount(item.url) > 0 && (
                              <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
                            )}
                          </span>
                        )}
                        <span>{getSidebarTitle(item.title)}</span>
                        {item.url === "/matching" && (
                          <CountBadge count={matchingCount} />
                        )}
                        {item.url === "/favorite" && (
                          <CountBadge count={favoriteCount} />
                        )}
                        {item.url === "/message" && (
                          <CountBadge count={unreadMessages} />
                        )}
                        {item.url === "/notification" && (
                          <CountBadge count={unreadNotifications} />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
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
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={t("aiResumeBuilder")}
                      className={`font-medium py-3 ${
                        isPathActive("/resume-builder")
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                      asChild
                    >
                      <Link href="/resume-builder" prefetch={true}>
                        <LucideFileUser className="!size-6" strokeWidth={1.5} />
                        <span>{t("aiResumeBuilder")}</span>
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

      <SidebarFooter>
        {loading || !user ? (
          <SidebarDropdownFooterSkeleton />
        ) : (
          <SidebarDropdownFooter user={userData} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
