"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useForgotPasswordStore } from "@/stores/apis/auth/forgot-password.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useLanguageStore } from "@/stores/languages/language-store";
import { useThemeStore } from "@/stores/themes/theme-store";
import { cn } from "@/lib/utils";
import { TLanguage } from "@/utils/types/language.type";
import { TTheme } from "@/utils/types/theme.type";
import {
  LucideCheck,
  LucideGlobe,
  LucideInfo,
  LucideKeyRound,
  LucideLogIn,
  LucideMail,
  LucideMonitor,
  LucideMoon,
  LucidePalette,
  LucideShieldCheck,
  LucideSun,
  LucideUser,
} from "lucide-react";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

/* ─────────────────────── sub-components ─────────────────────── */

function SettingSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
          <span className="text-primary [&>svg]:size-4">{icon}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold leading-none">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 py-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-muted-foreground shrink-0 [&>svg]:size-4">
            {icon}
          </span>
          <span className="text-sm font-medium truncate">{label}</span>
        </div>
        <div className="shrink-0 text-sm text-muted-foreground">{value}</div>
      </div>
      {!last && <Separator />}
    </>
  );
}

function ThemeCard({
  value,
  label,
  icon,
  active,
  onClick,
}: {
  value: TTheme;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer w-full",
        active
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {/* Mini window preview */}
      <div
        className={cn(
          "w-full h-14 rounded-lg overflow-hidden border flex flex-col gap-1 p-1.5",
          value === "dark"
            ? "bg-zinc-900 border-zinc-700"
            : value === "light"
              ? "bg-white border-zinc-200"
              : "bg-gradient-to-br from-white via-zinc-100 to-zinc-800 border-zinc-300",
        )}
      >
        <div
          className={cn(
            "h-1.5 rounded-full w-3/4",
            value === "dark" ? "bg-zinc-600" : "bg-zinc-300",
          )}
        />
        <div
          className={cn(
            "h-1   rounded-full w-1/2",
            value === "dark" ? "bg-zinc-700" : "bg-zinc-200",
          )}
        />
        <div className="flex gap-1 mt-0.5">
          <div
            className={cn(
              "h-3 rounded flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
          <div
            className={cn(
              "h-3 rounded flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-1.5 justify-center">
        <span
          className={cn(
            "[&>svg]:size-3.5",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {/* Active checkmark */}
      {active && (
        <span className="absolute top-2 right-2 flex items-center justify-center size-4 rounded-full bg-primary">
          <LucideCheck
            className="size-2.5 text-primary-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}

function LanguageCard({
  value,
  flag,
  label,
  nativeLabel,
  active,
  onClick,
}: {
  value: TLanguage;
  flag: string;
  label: string;
  nativeLabel: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer w-full text-left",
        active
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      <span className="text-2xl shrink-0">{flag}</span>
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={cn("text-sm font-semibold", active ? "text-primary" : "")}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{nativeLabel}</span>
      </div>
      {active && (
        <span className="flex items-center justify-center size-5 rounded-full bg-primary shrink-0">
          <LucideCheck
            className="size-3 text-primary-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}

/* ───────────────────────── Page ───────────────────────────────── */

export default function SettingPage() {
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const { theme, setTheme: setStoreTheme } = useThemeStore();
  const { setTheme: setNextTheme } = useTheme();
  const { language, setLanguage } = useLanguageStore();
  const { forgotPassword } = useForgotPasswordStore();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  /* ── theme ── */
  const handleThemeChange = (t: TTheme) => {
    setStoreTheme(t);
    setNextTheme(t);
    setCookie("theme", t);
  };

  /* ── language ── */
  const handleLanguageChange = (l: TLanguage) => {
    setLanguage(l);
    setCookie("language", l);
  };

  /* ── reset password ──
   * Read store state AFTER the awaited call resolves — no stale-state
   * race condition, no useEffect needed.
   */
  const handleSendReset = async () => {
    if (!currentUser?.email || sending) return;

    // Clear any leftover message/error from a previous call
    useForgotPasswordStore.setState({ message: null, error: null });
    setSending(true);

    await forgotPassword(currentUser.email);

    const { error, message } = useForgotPasswordStore.getState();
    setSending(false);

    if (error) {
      toast.error(message ?? "Failed to send reset email. Please try again.");
    } else {
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    }
  };

  /* ── account helpers ── */
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

  /* ─────────────────────── Render ──────────────────────────────── */
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 px-3 py-6 sm:px-5 sm:py-8">
      {/* Page title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences and account details.
        </p>
      </div>

      {/* ══════════════ APPEARANCE ══════════════ */}
      <SettingSection
        icon={<LucidePalette />}
        title="Appearance"
        description="Choose how Apsara Talent looks for you"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="grid grid-cols-3 gap-3">
            <ThemeCard
              value="light"
              label="Light"
              icon={<LucideSun />}
              active={theme === "light"}
              onClick={() => handleThemeChange("light")}
            />
            <ThemeCard
              value="dark"
              label="Dark"
              icon={<LucideMoon />}
              active={theme === "dark"}
              onClick={() => handleThemeChange("dark")}
            />
            <ThemeCard
              value="system"
              label="System"
              icon={<LucideMonitor />}
              active={theme === "system"}
              onClick={() => handleThemeChange("system")}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {theme === "system"
              ? "Follows your device's system preference"
              : `Using ${theme} mode`}
          </p>
        </div>
      </SettingSection>

      {/* ══════════════ LANGUAGE ══════════════ */}
      <SettingSection
        icon={<LucideGlobe />}
        title="Language"
        description="Select the language used throughout the app"
      >
        <div className="flex flex-col gap-3 p-4">
          <LanguageCard
            value="en"
            flag="🇬🇧"
            label="English"
            nativeLabel="English"
            active={language === "en"}
            onClick={() => handleLanguageChange("en")}
          />
          <LanguageCard
            value="km"
            flag="🇰🇭"
            label="Khmer"
            nativeLabel="ភាសាខ្មែរ"
            active={language === "km"}
            onClick={() => handleLanguageChange("km")}
          />
        </div>
      </SettingSection>

      {/* ══════════════ ACCOUNT ══════════════ */}
      <SettingSection
        icon={<LucideUser />}
        title="Account"
        description="Your account details and security"
      >
        {/* Avatar header */}
        <div className="flex items-center gap-4 px-4 py-4 bg-muted/30">
          <Avatar className="size-14 rounded-xl shrink-0">
            <AvatarImage src={avatarSrc} alt={displayName} />
            <AvatarFallback className="rounded-xl text-base font-semibold">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-sm leading-none truncate">
              {displayName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email ?? "—"}
            </p>
            <Badge
              variant="secondary"
              className="w-fit mt-0.5 text-[10px] capitalize"
            >
              {currentUser?.role ?? "—"}
            </Badge>
          </div>
        </div>
        <Separator />

        <SettingRow
          icon={<LucideMail />}
          label="Email"
          value={currentUser?.email ?? "—"}
        />
        <SettingRow
          icon={<LucideShieldCheck />}
          label="Two-Factor Auth"
          value={
            currentUser?.isTwoFactorEnabled ? (
              <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-300/40 hover:bg-emerald-500/10">
                Enabled
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[10px] text-muted-foreground"
              >
                Disabled
              </Badge>
            )
          }
        />
        <SettingRow
          icon={<LucideLogIn />}
          label="Last Login"
          value={lastLogin}
        />
        <SettingRow
          icon={<LucideInfo />}
          label="Member Since"
          value={memberSince}
        />

        {/* ── Reset Password row ── */}
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-muted-foreground shrink-0 [&>svg]:size-4">
              <LucideKeyRound />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Reset Password</span>
              <span className="text-xs text-muted-foreground">
                Send a reset link to your email
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 text-xs rounded-lg"
            onClick={() => {
              setSent(false);
              setResetDialogOpen(true);
            }}
          >
            Reset
          </Button>
        </div>
      </SettingSection>

      {/* ══════════════ ABOUT ══════════════ */}
      <SettingSection
        icon={<LucideInfo />}
        title="About"
        description="App information"
      >
        <SettingRow
          icon={<LucideInfo />}
          label="Version"
          value={
            <Badge variant="secondary" className="text-[10px] font-mono">
              v1.0.0
            </Badge>
          }
        />
        <SettingRow
          icon={<LucideShieldCheck />}
          label="Privacy Policy"
          value={
            <Link href="/privacy" className="text-xs text-primary hover:underline">
              View →
            </Link>
          }
        />
        <SettingRow
          icon={<LucideInfo />}
          label="Terms of Service"
          value={
            <Link href="/terms" className="text-xs text-primary hover:underline">
              View →
            </Link>
          }
          last
        />
      </SettingSection>

      {/* ══════════════ RESET PASSWORD DIALOG ══════════════ */}
      <Dialog
        open={resetDialogOpen}
        onOpenChange={(o) => {
          setResetDialogOpen(o);
          if (!o) setSent(false);
        }}
      >
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            {/* Icon */}
            <div className="mx-auto mb-2 flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20">
              <LucideKeyRound className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center">
              Reset your password
            </DialogTitle>
            <DialogDescription className="text-center text-sm leading-relaxed">
              {sent ? (
                <>
                  We've sent a reset link to{" "}
                  <span className="font-semibold text-foreground">
                    {currentUser?.email}
                  </span>
                  . Check your inbox and follow the instructions.
                </>
              ) : (
                <>
                  We'll send a password reset link to{" "}
                  <span className="font-semibold text-foreground">
                    {currentUser?.email}
                  </span>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            {sent ? (
              <Button
                className="w-full rounded-xl"
                onClick={() => setResetDialogOpen(false)}
              >
                Done
              </Button>
            ) : (
              <>
                <Button
                  className="w-full rounded-xl"
                  onClick={handleSendReset}
                  disabled={sending}
                >
                  {sending ? "Sending…" : "Send Reset Link"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setResetDialogOpen(false)}
                  disabled={sending}
                >
                  Cancel
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
