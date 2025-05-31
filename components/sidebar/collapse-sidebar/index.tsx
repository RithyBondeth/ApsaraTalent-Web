"use client";
import React, { useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { Separator } from "@/components/ui/separator";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  useLocalLoginStore,
  useLoginStore,
  useSessionLoginStore,
} from "@/stores/apis/auth/login.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { SidebarDropdownFooterSkeleton } from "./sidebar-dropdown-footer/skeleton";

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { open } = useSidebar();

  const { getCurrentUser, user, loading } = useGetCurrentUserStore();
  const isEmployee = user?.role === "employee" && user.employee;
  const isCompany = user?.role === "company" && user.company;

  useEffect(() => {
    const local = useLocalLoginStore.getState();
    const session = useSessionLoginStore.getState();
    const source = local.accessToken ? local : session;

    if (source.accessToken) {
      useLoginStore.setState({
        accessToken: source.accessToken,
        refreshToken: source.refreshToken,
        message: source.message,
        rememberMe: source === local,
      });
      getCurrentUser(source.accessToken);
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => router.push("/feed")}>
        {open ? (
          <LogoComponent />
        ) : (
          <SidebarMenuButton tooltip="Apsara Talent" className="text-sm">
            <TypographyP className="!m-0 text-md font-bold">AP</TypographyP>
          </SidebarMenuButton>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-3">
            {sidebarList.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={true}
                className="group/collapsible"
                onClick={() => router.push(`${item.url}`)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="text-sm">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
              </Collapsible>
            ))}
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
                ? user?.company?.name!
                : "",
              email: user?.email! || user?.phone!,
              avatar: isEmployee
                ? user.employee?.avatar!
                : isCompany
                ? user?.company?.avatar!
                : "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
