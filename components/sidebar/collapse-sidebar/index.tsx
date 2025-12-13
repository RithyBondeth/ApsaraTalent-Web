"use client";
import React from "react";
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
import { useEffect, useMemo } from "react";
import { useCountCurrentEmployeeMatchingStore } from "@/stores/apis/matching/count-current-employee-matching.store";
import { useCountCurrentCompanyMatchingStore } from "@/stores/apis/matching/count-current-company-matching.store";
import { useCountAllCompanyFavoritesStore } from "@/stores/apis/favorite/count-all-company-favorites.store";
import { useCountAllEmployeeFavoritesStore } from "@/stores/apis/favorite/count-all-employee-favorites.store";

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();

  const { user, loading } = useGetCurrentUserStore();
  const isEmployee = user?.role === "employee" && user.employee;
  const isCompany = user?.role === "company" && user.company;

  const { countCurrentEmployeeMatching, totalEmpMatching } =
    useCountCurrentEmployeeMatchingStore();
  const { countCurrentCompanyMatching, totalCmpMatching } =
    useCountCurrentCompanyMatchingStore();
  const { totalAllEmployeeFavorites, countAllEmployeeFavorites } =
    useCountAllEmployeeFavoritesStore();
  const { totalAllCompanyFavorites, countAllCompanyFavorites } =
    useCountAllCompanyFavoritesStore();

  // Ensure matching counts are populated even if user hasn't visited the Matching page
  useEffect(() => {
    if (isEmployee && user?.employee?.id) {
      countCurrentEmployeeMatching(user.employee.id);
    } else if (isCompany && user?.company?.id) {
      countCurrentCompanyMatching(user.company.id);
    }
  }, [isEmployee, isCompany, totalEmpMatching, totalCmpMatching]);

  // Ensure favorites counts are populated even if user hasn't visited the Favorites page
  useEffect(() => {
    if (user) {
      if (isEmployee && user.employee) {
        countAllEmployeeFavorites(user.employee.id);
      } else if (isCompany && user.company) {
        countAllCompanyFavorites(user.company.id);
      }
    }
  }, [
    isEmployee,
    isCompany,
    totalAllEmployeeFavorites,
    totalAllCompanyFavorites,
  ]);

  const matchingCount = useMemo(() => {
    if (isEmployee) return totalEmpMatching ?? 0;
    if (isCompany) return totalCmpMatching ?? 0;
    return 0;
  }, [isEmployee, isCompany, totalEmpMatching, totalCmpMatching]);

  const favoriteCount = useMemo(() => {
    if (isEmployee) return totalAllEmployeeFavorites ?? 0;
    if (isCompany) return totalAllEmployeeFavorites ?? 0;
    return 0;
  }, [
    isEmployee,
    isCompany,
    totalAllEmployeeFavorites,
    totalAllEmployeeFavorites,
  ]);

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
                onClick={() => {
                  const searchUserRole = user?.role;
                  if (item.url === "/search") {
                    router.push(`${item.url}/${searchUserRole}`);
                  } else {
                    router.push(`${item.url}`);
                  }
                }}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`font-medium py-3 ${
                        pathname === item.url ||
                        pathname.startsWith(`${item.url}/`)
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
                      {item.url === "/matching" && matchingCount > 0 && (
                        <Badge className="ml-auto bg-red-500">
                          {matchingCount}
                        </Badge>
                      )}
                      {item.url === "/favorite" && favoriteCount > 0 && (
                        <Badge className="ml-auto bg-red-500">
                          {favoriteCount}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <Collapsible
              asChild
              defaultOpen={true}
              className={`group/collapsible ${isCompany && "hidden"}`}
              onClick={() => router.push("/resume-builder")}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={"AI Resume"}
                    className={`font-medium py-3 ${
                      pathname === "/resume-builder" ||
                      pathname.startsWith("/resume-builder")
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        {loading || !user ? (
          <SidebarDropdownFooterSkeleton />
        ) : (
          <SidebarDropdownFooter
            user={{
              name: isEmployee
                ? `${user.employee?.username}`
                : isCompany
                ? user?.company?.name ?? ""
                : "",
              email: (user?.email ?? "") || (user?.phone ?? ""),
              avatar: isEmployee
                ? user.employee?.avatar ?? ""
                : isCompany
                ? user?.company?.avatar ?? ""
                : "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
