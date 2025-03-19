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
} from "../ui/sidebar";
import LogoComponent from "../utils/logo";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import {
  BellRing,
  Handshake,
  Home,
  MessageCircle,
  SearchCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarDropdownFooter } from "./sidebar-dropdown-footer";

export default function CollapseSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const navList = [
    {
      title: "Feed",
      url: "/feed",
      icon: Home,
      isActive: true,
    },
    {
      title: "Search",
      url: "/search",
      icon: SearchCheck,
    },
    {
      title: "Matching",
      url: "/matching",
      icon: Handshake,
    },
    {
      title: "Message",
      url: "/message",
      icon: MessageCircle,
    },
    {
      title: "Notification",
      url: "/notification",
      icon: BellRing,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoComponent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navList.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={true}
                className="group/collapsible"
                onClick={() => router.push(`${item.url}`)}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
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
      <SidebarFooter>
        <SidebarDropdownFooter user={{
            name: "Rithy Bondeth",
            email: "rithybondeth999@gamil.com",
            avatar: "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
