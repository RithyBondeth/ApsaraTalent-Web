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
import { BlockedUsersSection } from "@/components/setting/blocked-users-section";
import { AboutSection } from "@/components/setting/about-section";
import { ResetPasswordDialog } from "@/components/setting/reset-password-dialog";
import { TwoFactorDialog } from "@/components/setting/two-factor-dialog";
import { T2FADialogMode } from "@/components/setting/two-factor-dialog/props";
import SettingLoadingSkeleton from "@/components/setting/skeleton";
import { LucideSettings2 } from "lucide-react";

export default function SettingPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");
  const tS = useTranslations("setting");

  /* ----------------------------- API Integration ---------------------------- */
  // Get Current User and App Settings
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const { theme, setTheme: setStoreTheme } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();
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
      <header className="relative overflow-hidden border border-t-[5px] border-border border-t-primary bg-card px-5 py-7 shadow-[5px_5px_0_hsl(var(--foreground)/0.055)] sm:px-7 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-16 size-52 rotate-12 border-[28px] border-primary/5" />
        <div className="relative flex items-start gap-4 sm:gap-5">
          <div className="flex size-11 shrink-0 items-center justify-center bg-primary text-primary-foreground sm:size-12">
            <LucideSettings2 className="size-5 sm:size-6" />
          </div>
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.24em] text-primary">
              Apsara Talent
            </p>
            <h1 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              {tS("title")}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {tS("description")}
            </p>
          </div>
        </div>
      </header>

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
