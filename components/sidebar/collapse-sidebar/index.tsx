"use client";
import React, { useMemo, useCallback } from "react";
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
import { Collapsible, CollapsibleTrigger } from "../../ui/collapsible";
import { usePathname, useRouter } from "next/navigation";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { Separator } from "@/components/ui/separator";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { SidebarDropdownFooterSkeleton } from "./sidebar-dropdown-footer/skeleton";
import { LucideFileUser } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";
import { useFetchOnce } from "@/hooks/use-fetch-once";

// Badge Component
const CountBadge = ({ count }: { count: number }) => {
  if (count === 0) return null;
  return <Badge className="ml-auto bg-red-500 dark:text-primary">{count}</Badge>;
};

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Utils
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();

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

  // Memoized navigation handler
  const handleNavigation = useCallback(
    (url: string) => {
      if (url === "/search") {
        router.push(`${url}/${user?.role}`);
      } else {
        router.push(url);
      }
    },
    [router, user?.role]
  );

  // Check if a path is active
  const isPathActive = useCallback(
    (url: string) => {
      return pathname === url || pathname.startsWith(`${url}/`);
    },
    [pathname]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => router.push("/feed")}>
        {open ? (
          <LogoComponent priority={true} />
        ) : (
          <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
            <LogoComponent withoutTitle />
          </SidebarMenuButton>
        )}
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
                onClick={() => handleNavigation(item.url)}
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
                    >
                      {item.icon && (
                        <item.icon
                          className="!size-6 group-data-[collapsible=icon]:pr-1"
                          strokeWidth={1.5}
                        />
                      )}
                      <span>{item.title}</span>
                      {item.url === "/matching" && (
                        <CountBadge count={matchingCount} />
                      )}
                      {item.url === "/favorite" && (
                        <CountBadge count={favoriteCount} />
                      )}
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
                onClick={() => router.push("/resume-builder")}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip="AI Resume"
                      className={`font-medium py-3 ${
                        isPathActive("/resume-builder")
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      <LucideFileUser className="!size-6" strokeWidth={1.5} />
                      <span>AI Resume Builder</span>
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
