"use client";

import TopNavbar from "@/components/navbar/top-navbar";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useChatConnection } from "@/hooks/chat/use-chat-connection";
import { usePushNotifications } from "@/hooks/notification/use-push-notifications";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
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
  /* ----------------------------- API Integration ---------------------------- */
  const user = useGetCurrentUserStore((s) => s.user);

  /* --------------------------------- Effects -------------------------------- */
  usePushNotifications();
  // Keep chat socket alive on all pages for real-time badge updates
  useChatConnection();

  /* ── Feed detail page: no chrome ─────────────────────────────── */
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

  /* ── Message page: full-height layout ────────────────────────── */
  const isMessage = pathname.startsWith("/message");

  return (
    <ThemeProviderClient defaultTheme={theme}>
      <ScrollProgressBar />
      <TopNavbar key={user?.id ?? "nouser"} />
      <main
        className={
          isMessage
            ? /* Fill the viewport height below the navbar (64px) and above
               the mobile bottom bar (also 64px on small screens). */
              "h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4rem)] flex flex-col"
            : /* Regular pages: container with padding + bottom-bar clearance on mobile */
              "container mx-auto px-3 sm:px-4 lg:px-6 py-5 pb-24 lg:pb-8 animate-page-in"
        }
      >
        {children}
      </main>
    </ThemeProviderClient>
  );
}
