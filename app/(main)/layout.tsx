"use client";

import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import { Button } from "@/components/ui/button";
import { LucideArrowLeft } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sidebarData = sidebarList.filter((item) => item.url === pathname);

  const { theme } = useThemeStore();
  const user = useGetCurrentUserStore((s) => s.user);

  /**
   * Feed detail page
   */
  if (pathname.startsWith("/feed/")) {
    return (
      <div className="relative">
        <Link href="/feed" className="absolute top-5 left-5 z-20">
          <Button variant="outline" size="icon">
            <LucideArrowLeft />
          </Button>
        </Link>
        <div className="container mx-auto p-5">{children}</div>
      </div>
    );
  }

  /**
   * Reusable sidebar layout
   */
  const renderSidebarLayout = (title: string) => (
    <SidebarProvider>
      <CollapseSidebar key={user?.id || "nouser"} />
      <div className="w-full h-screen message-xs:h-full flex flex-col">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <TypographyP className="!m-0">{title}</TypographyP>
            </div>
          </header>
        </SidebarInset>
        <div className="h-full">{children}</div>
      </div>
    </SidebarProvider>
  );

  if (pathname.startsWith("/message")) return renderSidebarLayout("Chat");
  if (pathname.startsWith("/resume-builder"))
    return renderSidebarLayout("AI Resume Builder");
  if (pathname.startsWith("/search"))
    return renderSidebarLayout("Search your favorite");
  if (pathname.startsWith("/matching"))
    return renderSidebarLayout("Matching");
  if (pathname.startsWith("/favorite"))
    return renderSidebarLayout("Favorites");
  if (pathname.startsWith("/profile"))
    return renderSidebarLayout("Profile Page");
  if (pathname.startsWith("/setting"))
    return renderSidebarLayout("Setting Page");

  /**
   * Default layout
   */
  return (
    <ThemeProviderClient defaultTheme={theme}>
      <SidebarProvider>
        <CollapseSidebar key={user?.id || "nouser"} />
        <div className="w-full">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">
                  {sidebarData[0]?.description}
                </TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className="m-5">{children}</div>
        </div>
      </SidebarProvider>
    </ThemeProviderClient>
  );
}