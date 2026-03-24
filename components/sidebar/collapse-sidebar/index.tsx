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
import LogoComponent from "../../utils/logo";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { SidebarDropdownFooterSkeleton } from "./sidebar-dropdown-footer/skeleton";

/* ─────────────────────────────────────────────────────────────────────────
   Inline badge (expanded sidebar)
   ───────────────────────────────────────────────────────────────────────── */
const CountBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-none text-destructive-foreground ring-[2px] ring-destructive/20">
      {count > 99 ? "99+" : count}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Floating badge (collapsed sidebar) — with ping animation for attention
   ───────────────────────────────────────────────────────────────────────── */
const FloatingBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return (
    <span className="pointer-events-none absolute -top-1.5 right-0.5 z-50">
      {/* Ping ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-60" />
      {/* Solid badge */}
      <span className="relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
        {count > 99 ? "99+" : count}
      </span>
    </span>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   Section label with coloured dot marker
   ───────────────────────────────────────────────────────────────────────── */
const NavGroupLabel = ({ children }: { children: React.ReactNode }) => (
  <SidebarGroupLabel className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
    {children}
  </SidebarGroupLabel>
);

/* ─────────────────────────────────────────────────────────────────────────
   Shared button className
   Active:  gradient fill + inset left glow accent + outer drop shadow
   Hover:   2 px slide-right micro-animation (cancelled on active items)
   ───────────────────────────────────────────────────────────────────────── */
const MENU_BTN_CLS = [
  "group-data-[collapsible=icon]:justify-center",
  "font-medium",
  "px-2.5 py-2.5",
  "text-[15px] md:text-sm",
  "transition-all duration-300 ease-out",
  /* hover slide-right on non-active items */
  "hover:translate-x-[2px]",
  /* ── active state ── */
  "data-[active=true]:bg-gradient-to-r",
  "data-[active=true]:from-primary",
  "data-[active=true]:to-primary/80",
  "data-[active=true]:text-primary-foreground",
  "data-[active=true]:font-semibold",
  /* inset left accent bar + outer glow */
  "data-[active=true]:shadow-[inset_3px_0_0_hsl(var(--primary-foreground)/0.3),_0_6px_20px_hsl(var(--primary)/0.4)]",
  "data-[active=true]:animate-sidebar-active-in",
  /* cancel slide on active */
  "data-[active=true]:translate-x-0",
  "hover:data-[active=true]:translate-x-0",
  /* lock gradient on hover-over-active */
  "hover:data-[active=true]:bg-gradient-to-r",
  "hover:data-[active=true]:from-primary",
  "hover:data-[active=true]:to-primary/80",
  "hover:data-[active=true]:text-primary-foreground",
].join(" ");

/* ═══════════════════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const t = useTranslations("sidebar");
  const isExpanded = isMobile ? true : open;

  /* ── i18n map ─────────────────────────────── */
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

  /* ── API stores ───────────────────────────── */
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

  /* ── Hydration guard — defer role-dependent UI until client ── */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ── Derived counts ─────────────────────── */
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

  /* ── Helpers ─────────────────────────────── */
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

  /* ── Nav item renderer ───────────────────── */
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
                {/* Icon — bolder stroke when active for extra punch */}
                <Icon
                  className="!size-5 shrink-0 transition-all duration-300"
                  strokeWidth={active ? 2.2 : 1.5}
                />
                <span className="group-data-[collapsible=icon]:hidden">
                  {title}
                </span>
                {/* Inline badge (expanded only) */}
                {isExpanded && count > 0 && (
                  <span className="group-data-[collapsible=icon]:hidden">
                    <CountBadge count={count} />
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {/* Floating badge with ping — collapsed only */}
          {!isExpanded && <FloatingBadge count={count} />}
        </SidebarMenuItem>
      </Collapsible>
    );
  };

  /* ── Render ──────────────────────────────── */
  return (
    <Sidebar collapsible="icon" {...props}>

      {/* ══ Logo / Header ══ */}
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

      <Separator className="mb-1" />

      {/* ══ Nav items ══ */}
      <SidebarContent className="pb-1">

        {/* Navigation group */}
        <SidebarGroup>
          <NavGroupLabel>{t("navigationGroup")}</NavGroupLabel>
          <SidebarMenu className="space-y-0.5">
            {sidebarList.map((item) =>
              renderNavItem(item.url, getSidebarTitle(item.title), item.icon),
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Tools group — employees only (deferred until after hydration) */}
        {mounted && isEmployee && (
          <SidebarGroup>
            <NavGroupLabel>{t("toolsGroup")}</NavGroupLabel>
            <SidebarMenu>
              {renderNavItem("/resume-builder", t("aiResumeBuilder"), LucideFileUser, 0)}
            </SidebarMenu>
          </SidebarGroup>
        )}

      </SidebarContent>

      <Separator />

      {/* ══ Footer / user menu ══ */}
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
