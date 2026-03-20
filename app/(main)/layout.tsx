"use client";

import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
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
        <Link href="/feed" className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-5 lg:left-5 z-20">
          <Button variant="outline" size="icon">
            <LucideArrowLeft />
          </Button>
        </Link>
        <div key={pathname} className="container mx-auto p-3 sm:p-4 lg:p-5 animate-page-in">
          {children}
        </div>
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
    if (pathname.startsWith("/message"))
      return "w-full h-screen h-[100dvh] flex flex-col";
    return "w-full";
  };

  const getChildrenWrapperClass = () => {
    if (pathname.startsWith("/message")) return "h-full min-h-0";
    return "m-3 sm:m-4 lg:m-5";
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
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-2.5 sm:px-4 [padding-top:env(safe-area-inset-top)]">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 px-0.5 sm:px-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0 truncate text-[15px] sm:text-base">
                  {getHeaderTitle()}
                </TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div
            key={pathname}
            className={`${getChildrenWrapperClass()} animate-page-in`}
          >
            {children}
          </div>
        </div>
      </SidebarProvider>
    </ThemeProviderClient>
  );
}
