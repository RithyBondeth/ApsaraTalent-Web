"use client";

import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { TLanguage } from "@/utils/types/app/language.type";
import { TTheme } from "@/utils/types/app/theme.type";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppearanceSection } from "@/components/setting/appearance-section";
import { LanguageSection } from "@/components/setting/language-section";
import { AccountSection } from "@/components/setting/account-section";
import { AboutSection } from "@/components/setting/about-section";
import { ResetPasswordDialog } from "@/components/setting/reset-password-dialog";
import { TypographyH2 } from "@/components/utils/typography/typography-h2";
import { TypographyP } from "@/components/utils/typography/typography-p";
import SettingLoadingSkeleton from "@/components/setting/skeleton";

export default function SettingPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");

  /* ----------------------------- API Integration ---------------------------- */
  // Get Current User and App Settings
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const { theme, setTheme: setStoreTheme } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();
  const { language, setLanguage } = useLanguageStore();

  // Security Integration
  const { forgotPassword } = useForgotPasswordStore();

  /* -------------------------------- All States ------------------------------ */
  // Dialog and Process States
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);

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
  const handleThemeChange = (t: TTheme) => {
    setStoreTheme(t);
    setNextTheme(t);
    setCookie("theme", t);
  };

  // ── Handle Language Change ──────────────────────────────
  const handleLanguageChange = (l: TLanguage) => {
    setLanguage(l);
    setCookie("language", l);
  };

  // ── Security and Account Methods ──────────────────────────────────────────
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
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 px-3 py-6 sm:px-5 sm:py-8 animate-page-in">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <TypographyH2>Settings</TypographyH2>
        <TypographyP className="text-muted-foreground !m-0">
          Manage your preferences and account details.
        </TypographyP>
      </div>

      {/* Appearance Section */}
      <AppearanceSection theme={theme} onThemeChange={handleThemeChange} />

      {/* Language Section */}
      <LanguageSection
        language={language}
        onLanguageChange={handleLanguageChange}
      />

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
      />

      {/* About Section */}
      <AboutSection />

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
