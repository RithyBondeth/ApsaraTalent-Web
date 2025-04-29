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
import { useRouter } from "next/navigation";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";
import { Separator } from "@/components/ui/separator";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { userList } from "@/data/user-data";

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { open } = useSidebar();

  const employeeList = userList.filter((user) => user.role === "employee");
  const employee = employeeList[1].employee;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader onClick={() => router.push('/feed')}>
        {open ? (
          <LogoComponent/>
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
        <SidebarDropdownFooter
          user={{
            name: employee?.firstname + " " + employee?.lastname,
            email: employeeList[1].email,
            avatar: employee?.avatar!,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
