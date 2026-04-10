"use client";

import CollapseSidebar from "@/components/sidebar/collapse-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useChatConnection } from "@/hooks/chat/use-chat-connection";
import { usePushNotifications } from "@/hooks/notification/use-push-notifications";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { sidebarList } from "@/utils/constants/sidebar.constant";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const sidebarData = sidebarList.filter((item) => item.url === pathname);
  const t = useTranslations("header");
  const { theme } = useThemeStore();

  /* ----------------------------- API Integration ---------------------------- */
  const user = useGetCurrentUserStore((s) => s.user);

  /* --------------------------------- Effects -------------------------------- */
  usePushNotifications();
  // Keep chat socket alive on all pages for real-time badge updates
  useChatConnection();

  /* --------------------------------- Methods -------------------------------- */
  // ── Determine header title ─────────────────────────────────────────
  const getHeaderTitle = () => {
    if (pathname.startsWith("/feed")) return t("feedDescription");
    if (pathname.startsWith("/message")) return t("chat");
    if (pathname.startsWith("/resume-builder")) return t("aiResumeBuilder");
    if (pathname.startsWith("/search")) return t("searchFavorite");
    if (pathname.startsWith("/matching")) return t("matching");
    if (pathname.startsWith("/favorite")) return t("favorites");
    if (pathname.startsWith("/profile")) return t("profilePage");
    if (pathname.startsWith("/setting")) return t("settingPage");
    if (pathname.startsWith("/notification"))
      return t("notificationDescription");
    return sidebarData[0]?.description ?? "";
  };

  // ── Determine content wrapper class ─────────────────────────────────
  const getContentClass = () => {
    if (pathname.startsWith("/message"))
      return "w-full h-screen h-[100dvh] flex flex-col";
    return "w-full";
  };

  // ── Determine children wrapper class ────────────────────────────────
  const getChildrenWrapperClass = () => {
    if (pathname.startsWith("/message")) return "h-full min-h-0";
    return "m-3 sm:m-4 lg:m-5";
  };

  /* --------------------------------------------------------- Render UI --------------------------------------------------------- */
  // ── Feed Detail Page: No Sidebar ─────────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/feed/")) {
    return (
      <div className="relative">
        <ScrollProgressBar />
        <div className="container mx-auto p-3 sm:p-4 lg:p-5 animate-page-in">
          {children}
        </div>
      </div>
    );
  }

  // ── Single Stable Layout Tree: SidebarProvider never remounts on navigation ──────────────────────────
  return (
    <ThemeProviderClient defaultTheme={theme}>
      <ScrollProgressBar />
      <SidebarProvider>
        <CollapseSidebar key={user?.id || "nouser"} />
        <div className={getContentClass()}>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/95 backdrop-blur-sm px-2.5 sm:px-4 [padding-top:env(safe-area-inset-top)]">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 px-0.5 sm:px-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <TypographyP className="!m-0 truncate text-[15px] sm:text-base font-semibold">
                  {getHeaderTitle()}
                </TypographyP>
              </div>
            </header>
          </SidebarInset>
          <div className={`${getChildrenWrapperClass()} animate-page-in`}>
            {children}
          </div>
        </div>
      </SidebarProvider>
    </ThemeProviderClient>
  );
}
