"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarDropdownFooterSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-3 px-2 py-2 rounded-lg"
        >
          <Skeleton className="h-8 w-8 rounded-lg bg-muted" />
          <div className="flex flex-col gap-1 flex-1">
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="h-3 w-20 bg-muted" />
          </div>
          <Skeleton className="h-4 w-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
