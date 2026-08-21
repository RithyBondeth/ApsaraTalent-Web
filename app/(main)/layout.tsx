"use client";

import TopNavbar from "@/components/navbar/top-navbar";
import { ScrollProgressBar } from "@/components/utils/layout/scroll-progress-bar";
import { ScrollToTop } from "@/components/utils/layout/scroll-to-top";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useChatConnection } from "@/hooks/chat/use-chat-connection";
import { usePushNotifications } from "@/hooks/notification/use-push-notifications";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PageState } from "@/components/utils/feedback/page-state";
import { useTranslations } from "next-intl";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ------------------------------------ Utils ----------------------------------- */
  const pathname = usePathname();
  const t = useTranslations("states");
  const { theme } = useThemeStore();

  /* ---------------------------------- All States --------------------------------- */
  const requestedUser = useRef<boolean>(false);

  /* ------------------------------- API Integration ------------------------------ */
  const {
    user,
    loading: userLoading,
    error: userError,
    getCurrentUser,
  } = useGetCurrentUserStore();

  /* --------------------------------- All Effects -------------------------------- */
  usePushNotifications();
  // Keep chat socket alive on all pages for real-time badge updates
  useChatConnection();

  useEffect(() => {
    const currentUserState = useGetCurrentUserStore.getState();
    if (
      currentUserState.user ||
      currentUserState.loading ||
      requestedUser.current
    )
      return;
    requestedUser.current = true;
    void currentUserState.getCurrentUser();
  }, [getCurrentUser, user, userLoading]);

  if (!user && userError)
    return (
      <ThemeProviderClient defaultTheme={theme}>
        <main className="flex min-h-screen items-center px-3 sm:px-4 lg:px-5">
          <div className="mx-auto w-full max-w-3xl">
            <PageState
              variant="error"
              title={userError}
              description={t("sessionErrorDescription")}
              action={{
                label: t("retry"),
                onClick: () => void getCurrentUser(),
              }}
            />
          </div>
        </main>
      </ThemeProviderClient>
    );

  // ── Feed Detail Page: no chrome ───────────────────────────────
  if (pathname.startsWith("/feed/")) {
    return (
      <div className="relative">
        {/* Skip Navigation Section */}
        <a
          href="#main-content"
          className="sr-only z-[100] bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-hard-sm focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to main content
        </a>
        {/* Scroll Progress Bar Section */}
        <ScrollProgressBar />
        {/* Main Content Section */}
        <main
          id="main-content"
          tabIndex={-1}
          className="animate-page-in container mx-auto p-3 sm:p-4 lg:p-5"
        >
          {children}
        </main>
      </div>
    );
  }

  // ── Message Page: full-height layout ──────────────────────────
  const isMessage = pathname.startsWith("/message");

  return (
    <ThemeProviderClient defaultTheme={theme}>
      {/* Skip Navigation Section */}
      <a
        href="#main-content"
        className="sr-only z-[100] bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-hard-sm focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to main content
      </a>
      {/* Scroll Progress Bar Section */}
      <ScrollProgressBar />
      {/* Top Navbar Section */}
      <TopNavbar />
      {/* Main Content Section */}
      <main
        id="main-content"
        tabIndex={-1}
        className={
          isMessage
            ? "flex h-[calc(100dvh-8rem)] flex-col px-3 pb-3 sm:px-4 sm:pb-4 md:h-[calc(100dvh-4rem)] lg:px-5 lg:pb-5"
            : "container mx-auto px-3 py-5 pb-24 sm:px-4 lg:px-6 lg:pb-8"
        }
      >
        {children}
      </main>
      {/* Scroll to Top Section */}
      {!isMessage && <ScrollToTop />}
    </ThemeProviderClient>
  );
}
