import React from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "../ui/sidebar";
import LogoComponent from "../utils/logo";

export default function CollapseSidebar({ ...props }: React.ComponentProps<typeof Sidebar> ) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LogoComponent/>
            </SidebarHeader>
            <SidebarContent>
                
            </SidebarContent>
        </Sidebar>
    )
}