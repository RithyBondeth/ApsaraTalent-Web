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
import { useGetCurrentEmployeeMatchingStore } from "@/stores/apis/matching/get-current-employee-matching.store";
import { useGetCurrentCompanyMatchingStore } from "@/stores/apis/matching/get-current-company-matching.store";
import { useGetAllEmployeeFavoritesStore } from "@/stores/apis/favorite/get-all-employee-favorites.store";
import { useGetAllCompanyFavoritesStore } from "@/stores/apis/favorite/get-all-company-favorites.store";

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();

  const { user, loading } = useGetCurrentUserStore();
  const isEmployee = user?.role === "employee" && user.employee;
  const isCompany = user?.role === "company" && user.company;

  const {
    currentEmployeeMatching,
    queryCurrentEmployeeMatching,
  } = useGetCurrentEmployeeMatchingStore();
  const {
    currentCompanyMatching,
    queryCurrentCompanyMatching,
  } = useGetCurrentCompanyMatchingStore();

  // Favorite stores (counts only; fetching occurs in pages)
  const { companyData, queryAllEmployeeFavorites } = useGetAllEmployeeFavoritesStore();
  const { employeeData, queryAllCompanyFavorites } = useGetAllCompanyFavoritesStore();

  useEffect(() => {
    if (isEmployee && user?.employee?.id) {
      queryCurrentEmployeeMatching(user.employee.id);
    } else if (isCompany && user?.company?.id) {
      queryCurrentCompanyMatching(user.company.id);
    }
  }, [isEmployee, isCompany, user?.employee?.id, user?.company?.id, queryCurrentEmployeeMatching, queryCurrentCompanyMatching]);

  // Ensure favorites counts are populated even if user hasn't visited the Favorites page
  useEffect(() => {
    if (isEmployee && user?.employee?.id) {
      queryAllEmployeeFavorites(user.employee.id);
    } else if (isCompany && user?.company?.id) {
      queryAllCompanyFavorites(user.company.id);
    }
  }, [isEmployee, isCompany, user?.employee?.id, user?.company?.id, queryAllEmployeeFavorites, queryAllCompanyFavorites]);

  const matchingCount = useMemo(() => {
    if (isEmployee) return currentEmployeeMatching?.length ?? 0;
    if (isCompany) return currentCompanyMatching?.length ?? 0;
    return 0;
  }, [isEmployee, isCompany, currentEmployeeMatching, currentCompanyMatching]);

  const favoriteCount = useMemo(() => {
    if (isEmployee) return companyData?.length ?? 0;
    if (isCompany) return employeeData?.length ?? 0;
    return 0;
  }, [isEmployee, isCompany, companyData, employeeData]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => router.push("/feed")}>
        {open ? (
          <LogoComponent className="!h-20 w-auto" priority={true} />
        ) : (
          <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
            {/* <TypographyP className="!m-0 text-md font-bold">AP</TypographyP> */}
            <LogoComponent withoutTitle/>
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
                        pathname === item.url || pathname.startsWith(`${item.url}/`)
                          ? "bg-muted"
                          : ""
                      }`}
                    >
                      {item.icon && <item.icon className="!size-6"/>}
                      <span>{item.title}</span>
                      {item.url === "/matching" && matchingCount > 0 && (
                        <Badge className="ml-auto bg-red-500">{matchingCount}</Badge>
                      )}
                      {item.url === "/favorite" && favoriteCount > 0 && (
                        <Badge className="ml-auto bg-red-500">{favoriteCount}</Badge>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
            <Collapsible
              asChild
              defaultOpen={true}
              className={`group/collapsible ${isCompany && 'hidden'}`}
              onClick={() => router.push('/resume-builder')}
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={"AI Resume"}
                    className="font-medium py-3"
                  >
                    <LucideFileUser className="!size-6"/>
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
                ? user?.company?.name ?? ''
                : "",
              email: (user?.email ?? '') || (user?.phone ?? ''),
              avatar: isEmployee
                ? user.employee?.avatar ?? ''
                : isCompany
                ? user?.company?.avatar ?? ''
                : "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
