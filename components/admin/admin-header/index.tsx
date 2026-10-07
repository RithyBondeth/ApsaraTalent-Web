"use client";

import { LogoutConfirmationDialog } from "@/components/auth/logout-confirmation-dialog";
import { Button } from "@/components/ui/button";
import Switcher from "@/components/utils/switcher";
import {
  clearAuthCookies,
  clearAuthCookiesServerSide,
} from "@/utils/auth/cookie-manager";
import { useLoginStore } from "@/stores/apis/auth/login.store";
import { useFacebookLoginStore } from "@/stores/apis/auth/socials/facebook-login.store";
import { useGithubLoginStore } from "@/stores/apis/auth/socials/github-login.store";
import { useGoogleLoginStore } from "@/stores/apis/auth/socials/google-login.store";
import { useLinkedInLoginStore } from "@/stores/apis/auth/socials/linkedin-login.store";
import { useVerifyOTPStore } from "@/stores/apis/auth/verify-otp.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { LucideLogOut, LucideShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * The admin panel's own header.
 *
 * The panel deliberately does not mount `TopNavbar` — that navbar is built
 * around a feed, matches and messages an administrator does not have. But
 * three things were living inside it that have nothing to do with being an
 * employee: the theme toggle, the language switch, and **sign out**.
 *
 * Losing sign-out mattered most. An administrator had no way to end their own
 * session from the panel, on the one surface where an abandoned session is
 * worth the most to whoever finds it. The language switch is a close second:
 * the panel is fully translated into Khmer and, without this, none of it was
 * reachable.
 *
 * `Switcher` and `LogoutConfirmationDialog` are the same components the auth
 * layout and the main navbar use, so the behaviour matches the rest of the
 * app rather than being a second implementation of it.
 */
export function AdminHeader() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("admin.header");
  const router = useRouter();

  /* -------------------------------- All States ------------------------------ */
  const [logoutOpen, setLogoutOpen] = useState(false);

  /* ----------------------------- API Integration ---------------------------- */
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const clearCurrentUser = useGetCurrentUserStore((state) => state.clearUser);
  const normalLogout = useLoginStore((state) => state.clearToken);
  const otpLogout = useVerifyOTPStore((state) => state.clearToken);
  const googleLogout = useGoogleLoginStore((state) => state.clearToken);
  const githubLogout = useGithubLoginStore((state) => state.clearToken);
  const linkedInLogout = useLinkedInLoginStore((state) => state.clearToken);
  const facebookLogout = useFacebookLoginStore((state) => state.clearToken);

  /* --------------------------------- Handlers ------------------------------- */
  /*
    Every provider's token is cleared, not just the one that signed this
    session in: an admin promoted from an account that once used Google still
    has that store populated, and leaving it behind would resurrect the
    session on the next page load.

    The favourites stores the navbar also clears are skipped — an admin has
    neither, and reaching for them here would only couple this to stores the
    panel never touches.
  */
  const handleLogout = async () => {
    normalLogout();
    otpLogout();
    googleLogout();
    githubLogout();
    linkedInLogout();
    facebookLogout();
    clearCurrentUser();

    // Server-side first for the httpOnly cookies, then client-side as backup.
    await clearAuthCookiesServerSide();
    clearAuthCookies();

    router.push("/");
    // A full reload drops every Zustand store, so nothing of this session
    // survives into the next one.
    window.location.reload();
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card px-4 py-3 shadow-hard-xs">
      <div className="flex min-w-0 items-center gap-2">
        <LucideShieldCheck
          aria-hidden
          className="size-4 shrink-0 text-primary"
        />
        <span className="truncate text-xs font-bold uppercase tracking-[0.14em] text-foreground">
          {t("title")}
        </span>
        {currentUser?.email ? (
          <span className="truncate text-xs text-muted-foreground">
            · {currentUser.email}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Switcher inline />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setLogoutOpen(true)}
        >
          <LucideLogOut aria-hidden />
          {t("signOut")}
        </Button>
      </div>

      <LogoutConfirmationDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
        title={t("confirmSignOut")}
        description={t("signOutQuestion")}
        cancelLabel={t("cancel")}
        confirmLabel={t("signOut")}
      />
    </header>
  );
}
