"use client";
import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { sidebarList } from "@/constants/sidebar.constant";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Exclude dynamic feed pages but include /feed
  if (
    (pathname.startsWith("/feed/") && pathname !== "/feed") ||
    pathname === "/profile/employee" ||
    pathname === "/profile/company"
  ) {
    return (
      <div className="relative">
        <Link href="/feed"  className="absolute top-5 left-5 z-20">
          <Button variant={"outline"} size="icon">
            <LucideArrowLeft />
          </Button>
        </Link>
        <div className="container mx-auto p-5">{children}</div>
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

  const sidebarData = sidebarList.filter((item) => item.url === pathname);
  
  // Default layout with both sidebars
  return (
    <SidebarProvider>
      <CollapseSidebar/>
      <div className="w-ful">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger/>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <TypographyP className="!m-0">{sidebarData[0].description}</TypographyP>
            </div>
          </header>
        </SidebarInset>
        <div className="!m-5">{children}</div>
      </div>
      <RightSidebar className="!min-w-[25%] laptop-sm:hidden"/>
    </SidebarProvider>
  );
}
