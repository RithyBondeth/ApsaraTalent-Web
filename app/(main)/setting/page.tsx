"use client";

import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useThemeTransition } from "@/hooks/utils/use-theme-transition";
import { TLanguage } from "@/utils/types/app/language.type";
import { TTheme } from "@/utils/types/app/theme.type";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppearanceSection } from "@/components/setting/appearance-section";
import { LanguageSection } from "@/components/setting/language-section";
import { AccountSection } from "@/components/setting/account-section";
import { BlockedUsersSection } from "@/components/setting/blocked-users-section";
import { AboutSection } from "@/components/setting/about-section";
import { ResetPasswordDialog } from "@/components/setting/reset-password-dialog";
import { TwoFactorDialog } from "@/components/setting/two-factor-dialog";
import { T2FADialogMode } from "@/components/setting/two-factor-dialog/props";
import SettingLoadingSkeleton from "@/components/setting/skeleton";

export default function SettingPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");
  const tS = useTranslations("setting");

  /* ----------------------------- API Integration ---------------------------- */
  // Get Current User and App Settings
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const { theme } = useThemeStore();
  const { setThemeWithReveal } = useThemeTransition();
  const { language, setLanguage } = useLanguageStore();

  // Security Integration
  const { forgotPassword } = useForgotPasswordStore();
  const { getCurrentUser } = useGetCurrentUserStore();

  /* -------------------------------- All States ------------------------------ */
  // Dialog and Process States
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] =
    useState<boolean>(false);
  const [twoFactorMode, setTwoFactorMode] = useState<T2FADialogMode>("enable");

  // Account helpers
  const displayName =
    currentUser?.employee?.username ??
    currentUser?.company?.name ??
    currentUser?.email ??
    "—";

  const avatarSrc =
    currentUser?.employee?.avatar ?? currentUser?.company?.avatar ?? undefined;

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const lastLogin = currentUser?.lastLoginAt
    ? new Date(currentUser.lastLoginAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  /* --------------------------------- Methods --------------------------------- */
  // ── Theme and Language Methods ──────────────────────────────────────────
  // ── Handle Theme Change ────────────────────────────────
  // Reveals from the pressed card, the same transition the navbar and the
  // public-page switcher use. The hook writes the store, next-themes and the
  // cookie itself, so this no longer does it by hand.
  const handleThemeChange = (
    t: TTheme,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setThemeWithReveal(t, event);
  };

  // ── Handle Language Change ──────────────────────────────
  const handleLanguageChange = (l: TLanguage) => {
    setLanguage(l);
    setCookie("language", l);
  };

  // ── Security and Account Methods ──────────────────────────────────────────
  // ── Handle Toggle 2FA ──────────────────────────────────
  const handleToggleTwoFactor = () => {
    setTwoFactorMode(currentUser?.isTwoFactorEnabled ? "disable" : "enable");
    setTwoFactorDialogOpen(true);
  };

  const handleTwoFactorSuccess = async () => {
    await getCurrentUser();
    toast.success(
      twoFactorMode === "enable"
        ? t("twoFactorEnabled")
        : t("twoFactorDisabled"),
    );
  };

  // ── API: Send Password Reset Link ───────────────────────
  const handleSendReset = async () => {
    if (!currentUser?.email || sending) return;

    // Clear any leftover message/error from a previous call
    useForgotPasswordStore.setState({ message: null, error: null });
    setSending(true);

    await forgotPassword(currentUser.email);

    const { error } = useForgotPasswordStore.getState();
    setSending(false);

    if (error) {
      toast.error(t("failedToSendResetEmail"));
    } else {
      setSent(true);
      toast.success(t("resetLinkSent"));
    }
  };

  /* ------------------------------- Loading State ----------------------------- */
  if (currentUser === null) return <SettingLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="animate-page-in mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Header Section */}
      <PageBanner
        eyebrow="Apsara Talent"
        title={tS("title")}
        subtitle={tS("description")}
      />

      <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-8">
        {/* Appearance Section */}
        <AppearanceSection theme={theme} onThemeChange={handleThemeChange} />

        {/* Language Section */}
        <LanguageSection
          language={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      {/* Account Section */}
      <AccountSection
        displayName={displayName}
        avatarSrc={avatarSrc}
        email={currentUser?.email}
        role={currentUser?.role}
        isTwoFactorEnabled={currentUser?.isTwoFactorEnabled ?? false}
        lastLogin={lastLogin}
        memberSince={memberSince}
        onResetPassword={() => {
          setSent(false);
          setResetDialogOpen(true);
        }}
        onToggleTwoFactor={handleToggleTwoFactor}
      />

      <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-8">
        {/* Blocked Users Section */}
        <BlockedUsersSection />

        {/* About Section */}
        <AboutSection />
      </div>

      {/* Two-Factor Auth Dialog Section */}
      <TwoFactorDialog
        open={twoFactorDialogOpen}
        mode={twoFactorMode}
        onOpenChange={setTwoFactorDialogOpen}
        onSuccess={handleTwoFactorSuccess}
      />

      {/* Reset Password Dialog Section */}
      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={(o) => {
          setResetDialogOpen(o);
          if (!o) setSent(false);
        }}
        email={currentUser?.email}
        sending={sending}
        onSendReset={handleSendReset}
        sent={sent}
      />
    </div>
  );
}
