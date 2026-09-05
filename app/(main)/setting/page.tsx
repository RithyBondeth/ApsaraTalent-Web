"use client";

import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { PageBanner } from "@/components/utils/layout/page-banner";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useNotificationPreferenceStore } from "@/stores/apis/notification/notification-preference.store";
import { useAccountLifecycleStore } from "@/stores/apis/users/account-lifecycle.store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { useThemeTransition } from "@/hooks/utils/use-theme-transition";
import { TLanguage } from "@/utils/types/app/language.type";
import { TTheme } from "@/utils/types/app/theme.type";
import { setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppearanceSection } from "@/components/setting/appearance-section";
import { LanguageSection } from "@/components/setting/language-section";
import { AccountSection } from "@/components/setting/account-section";
import { BlockedUsersSection } from "@/components/setting/blocked-users-section";
import { AboutSection } from "@/components/setting/about-section";
import { NotificationSection } from "@/components/setting/notification-section";
import { DangerZoneSection } from "@/components/setting/danger-zone-section";
import { DeleteAccountDialog } from "@/components/setting/delete-account-dialog";
import { DeletionScheduledBanner } from "@/components/setting/deletion-scheduled-banner";
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

  // Notification Preference Integration
  const {
    preferences,
    loading: preferencesLoading,
    loaded: preferencesLoaded,
    saving: preferencesSaving,
    getPreferences,
    updatePreferences,
  } = useNotificationPreferenceStore();

  useEffect(() => {
    if (!preferencesLoaded) getPreferences();
  }, [preferencesLoaded, getPreferences]);

  // Account Lifecycle Integration
  const {
    processing: lifecycleProcessing,
    requestDeletion,
    cancelDeletion,
  } = useAccountLifecycleStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  // ── API: Save Notification Preferences ──────────────────
  // The store applies the toggle optimistically and rolls it back on failure,
  // so this only has to say what went wrong.
  const handlePreferenceChange = async (
    payload: Parameters<typeof updatePreferences>[0],
  ) => {
    const saved = await updatePreferences(payload);
    if (!saved) toast.error(t("failedToSaveNotificationPreferences"));
  };

  // ── API: Request Account Deletion ──────────────────────
  const handleRequestDeletion = async () => {
    const result = await requestDeletion();
    if (!result) {
      toast.error(t("failedToRequestDeletion"));
      return false;
    }
    toast.success(t("deletionScheduledToast"));
    // Re-fetch so the banner appears — deletedAt is now populated server-side
    // and the cache was busted by the RPC.
    await getCurrentUser();
    return true;
  };

  // ── API: Cancel Account Deletion ───────────────────────
  const handleCancelDeletion = async () => {
    const ok = await cancelDeletion();
    if (!ok) {
      toast.error(t("failedToCancelDeletion"));
      return;
    }
    toast.success(t("deletionCancelledToast"));
    await getCurrentUser();
  };

  /* ------------------------------- Loading State ----------------------------- */
  if (currentUser === null) return <SettingLoadingSkeleton />;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="animate-page-in mx-auto flex w-full max-w-[1200px] flex-col gap-7 px-3 sm:gap-9 sm:px-4 lg:px-5">
      {/* Deletion Scheduled Banner Section */}
      {currentUser?.deletedAt ? (
        <DeletionScheduledBanner
          requestedAt={currentUser.deletedAt}
          processing={lifecycleProcessing}
          onCancel={handleCancelDeletion}
        />
      ) : null}

      {/* Header Section */}
      <PageBanner
        eyebrow={tS("bannerEyebrow")}
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

      {/* Notification Section */}
      <NotificationSection
        preferences={preferences}
        loading={preferencesLoading || !preferencesLoaded}
        saving={preferencesSaving}
        onChange={handlePreferenceChange}
      />

      <div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-8">
        {/* Blocked Users Section */}
        <BlockedUsersSection />

        {/* About Section */}
        <AboutSection />
      </div>

      {/* Danger Zone Section — export data or delete the account */}
      <DangerZoneSection
        onRequestDeletion={() => setDeleteDialogOpen(true)}
        processing={lifecycleProcessing}
      />

      {/* Delete Account Dialog Section */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleRequestDeletion}
        processing={lifecycleProcessing}
      />

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
