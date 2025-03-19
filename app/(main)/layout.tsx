"use client";
import CollapseSidebar from "@/components/collapse-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Exclude dynamic feed pages but include /feed
  if (
    (pathname.startsWith("/feed/") && pathname !== "/feed") ||
    pathname === "/profile/employee" ||
    pathname === "/profile/company"
  ) {
    return (
      <div className="relative p-5">
        <Link href="/feed">
          <Button variant={"outline"} size="icon" className="absolute top-5 left-5">
            <LucideArrowLeft />
          </Button>
        </Link>
        <div className="container mx-auto">{children}</div>
      </div>
    ); // No layout for /feed/[userId]
  }

  // Special layout for message page - no right sidebar
  if (pathname === "/message" || pathname.startsWith("/message/")) {
    return (
      <SidebarProvider>
        <CollapseSidebar/>
        <SidebarInset>
            <SidebarTrigger/>
        </SidebarInset>
        <div className="w-full">{children}</div>
      </SidebarProvider>
    );
  }

  // Default layout with both sidebars
  return (
    <SidebarProvider>
      <CollapseSidebar/>
     <SidebarInset>
         <SidebarTrigger/>
      </SidebarInset>
      <div className="w-full">{children}</div>
      <RightSidebar/>
    </SidebarProvider>
  );
}
