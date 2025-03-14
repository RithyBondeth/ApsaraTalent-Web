"use client";
import LeftSidebar from "@/components/sidebar/left-sidebar";
import RightSidebar from "@/components/sidebar/right-sidebar";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <Button
            variant={"outline"}
            size="icon"
            className="absolute top-5 left-5"
          >
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
      <div className="flex justify-between items-stretch gap-5 p-5">
        <LeftSidebar className="h-[calc(100vh-40px)] w-[20%] rounded-lg" />
        <div className="w-[80%]">{children}</div>
      </div>
    );
  }
  
  // Default layout with both sidebars
  return (
    <div className="flex justify-between items-start p-5">
      <LeftSidebar className="h-[calc(100vh-40px)] w-[20%] rounded-lg" />
      <div className="w-[55%] px-5">{children}</div>
      <RightSidebar className="w-[25%]" />
    </div>
  );
}