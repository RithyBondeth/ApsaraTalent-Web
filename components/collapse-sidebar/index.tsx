import React from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import LogoComponent from "../utils/logo";
import { Collapsible, CollapsibleTrigger } from "../ui/collapsible";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";

export default function CollapseSidebar({ ...props }: React.ComponentProps<typeof Sidebar> ) {
    const navList = [
        {
          title: "Playground",
          url: "#",
          icon: SquareTerminal,
          isActive: true,
        },
        {
          title: "Models",
          url: "#",
          icon: Bot,
        },
        {
          title: "Documentation",
          url: "#",
          icon: BookOpen,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings2,
        },
      ];

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LogoComponent/>
            </SidebarHeader>
            <SidebarContent>   
                <SidebarGroup>
                    <SidebarMenu>
                        {navList.map((item) => (
                            <Collapsible key={item.title} asChild defaultOpen={true} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon/>}
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}