"use client";

import { AdminNav } from "@/components/admin/admin-nav";
import { ScrollToTop } from "@/components/utils/layout/scroll-to-top";
import { ThemeProviderClient } from "@/components/utils/themes/theme-provider-client";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useTranslations } from "next-intl";

/**
 * The admin panel's own chrome.
 *
 * Deliberately not `(main)`'s layout: that one mounts the chat socket, push
 * notifications and the top navbar's feed/matching/message links, none of
 * which an administrator has. It also fetches the current user to render a
 * profile menu that would have no profile behind it.
 *
 * The route is gated in `middleware.ts` on the session role cookie. That is
 * presentation only — the cookie belongs to the browser. Every request this
 * panel makes is authorised server-side by AuthGuard + AdminGuard.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin");
  const { theme } = useThemeStore();

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <ThemeProviderClient defaultTheme={theme}>
      <a
        href="#main-content"
        className="sr-only z-[100] bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-hard-sm focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        {t("skipToContent")}
      </a>

      <main
        id="main-content"
        tabIndex={-1}
        className="container mx-auto flex flex-col gap-5 px-3 py-5 pb-24 sm:px-4 lg:px-6 lg:pb-8"
      >
        <AdminNav />
        {children}
      </main>

      <ScrollToTop />
    </ThemeProviderClient>
  );
}
