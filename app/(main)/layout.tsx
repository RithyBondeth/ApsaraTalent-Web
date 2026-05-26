"use client";

import TopNavbar from "@/components/navbar/top-navbar";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import { ScrollToTop } from "@/components/utils/layout/scroll-to-top";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useChatConnection } from "@/hooks/chat/use-chat-connection";
import { usePushNotifications } from "@/hooks/notification/use-push-notifications";
import { useThemeStore } from "@/stores/themes/theme-store";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const { theme } = useThemeStore();
  /* --------------------------------- Effects -------------------------------- */
  usePushNotifications();
  // Keep chat socket alive on all pages for real-time badge updates
  useChatConnection();

  // ── Feed Detail Page: no chrome ───────────────────────────────
  if (pathname.startsWith("/feed/")) {
    return (
      <div className="relative">
        {/* Scroll Progress Bar Section */}
        <ScrollProgressBar />
        {/* Main Content Section */}
        <div className="container mx-auto p-3 sm:p-4 lg:p-5 animate-page-in">
          {children}
        </div>
      </div>
    );
  }

  // ── Message Page: full-height layout ──────────────────────────
  const isMessage = pathname.startsWith("/message");

  return (
    <ThemeProviderClient defaultTheme={theme}>
      {/* Scroll Progress Bar Section */}
      <ScrollProgressBar />
      {/* Top Navbar Section */}
      <TopNavbar />
      {/* Main Content Section */}
      <main
        className={
          isMessage
            ? "h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)] flex flex-col"
            : "container mx-auto px-3 sm:px-4 lg:px-6 py-5 pb-24 lg:pb-8"
        }
      >
        {children}
      </main>
      {/* Scroll to Top Section */}
      {!isMessage && <ScrollToTop />}
    </ThemeProviderClient>
  );
}
