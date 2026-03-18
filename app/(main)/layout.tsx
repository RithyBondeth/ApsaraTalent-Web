"use client";

import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useChatConnection } from "@/hooks/use-chat-connection";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { LucideArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sidebarData = sidebarList.filter((item) => item.url === pathname);

  const { theme } = useThemeStore();
  const user = useGetCurrentUserStore((s) => s.user);
  const t = useTranslations("header");

  usePushNotifications();
  useChatConnection(); // Keep chat socket alive on all pages for real-time badge updates

  /**
   * Feed Detail Page — no sidebar
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
   * Determine header title
   */
  const getHeaderTitle = () => {
    if (pathname.startsWith("/message")) return t("chat");
    if (pathname.startsWith("/resume-builder")) return t("aiResumeBuilder");
    if (pathname.startsWith("/search")) return t("searchFavorite");
    if (pathname.startsWith("/matching")) return t("matching");
    if (pathname.startsWith("/favorite")) return t("favorites");
    if (pathname.startsWith("/profile")) return t("profilePage");
    if (pathname.startsWith("/setting")) return t("settingPage");
    return sidebarData[0]?.description ?? "";
  };

  /**
   * Determine content wrapper class
   */
  const getContentClass = () => {
    if (pathname.startsWith("/message")) return "w-full h-screen message-xs:h-full flex flex-col";
    return "w-full";
  };

  const getChildrenWrapperClass = () => {
    if (pathname.startsWith("/message")) return "h-full";
    return "m-5";
  };

  /**
   * Single stable layout tree — SidebarProvider never remounts on navigation
   */
  return (
    <ThemeProviderClient defaultTheme={theme}>
      <SidebarProvider>
        <CollapseSidebar key={user?.id || "nouser"} />
        <div className={getContentClass()}>
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0">{getHeaderTitle()}</TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div key={pathname} className={`${getChildrenWrapperClass()} animate-page-in`}>{children}</div>
        </div>
      </SidebarProvider>
    </ThemeProviderClient>
  );
}
