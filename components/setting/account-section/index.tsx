"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LucideInfo,
  LucideKeyRound,
  LucideLogIn,
  LucideMail,
  LucideShieldCheck,
  LucideUser,
} from "lucide-react";
import { SettingWrapper } from "../setting-wrapper";
import { SettingRow } from "../setting-row";
import { IAccountSectionProps } from "./props";
import { useTranslations } from "next-intl";
import { getNameInitials } from "@/utils/functions/text";

export function AccountSection(props: IAccountSectionProps) {
  /* --------------------------------- Props --------------------------------- */
  const {
    displayName,
    avatarSrc,
    email,
    role,
    isTwoFactorEnabled,
    lastLogin,
    memberSince,
    onResetPassword,
    onToggleTwoFactor,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideUser />}
      title={t("account")}
      description={t("accountDescription")}
    >
      {/* Header Section: Avatar, DisplayName, Email, Role */}
      <div className="relative flex items-center gap-4 overflow-hidden bg-[hsl(var(--illustration-surface))] px-4 py-5 sm:px-5">
        <span className="absolute -right-5 -top-8 size-24 rounded-full border border-brand/15" />
        <span className="absolute right-16 top-5 size-2 rounded-full bg-brand/25" />
        <Avatar className="size-14 shrink-0 rounded-xl ring-2 ring-card shadow-[0_8px_20px_hsl(var(--foreground)/0.1)]">
          <AvatarImage src={avatarSrc} alt={displayName} />
          <AvatarFallback className="rounded-xl text-base font-semibold">
            {getNameInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="relative flex min-w-0 flex-col gap-1">
          <TypographySmall className="block truncate font-semibold leading-none">
            {displayName}
          </TypographySmall>
          <TypographyMuted className="text-xs truncate">
            {email ?? "—"}
          </TypographyMuted>
          <Badge
            variant="secondary"
            className="mt-0.5 w-fit border border-brand/15 bg-brand-soft text-[10px] capitalize text-brand-soft-foreground hover:bg-brand-soft"
          >
            {role ?? "—"}
          </Badge>
        </div>
      </div>
      <Separator />

      {/* Email Section */}
      <SettingRow
        icon={<LucideMail />}
        label={t("email")}
        value={email ?? "—"}
      />

      {/* Two-Factor Auth Section */}
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 tablet-sm:flex-col tablet-sm:items-stretch">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/55 text-muted-foreground [&>svg]:size-4">
            <LucideShieldCheck />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{t("twoFactorAuth")}</span>
            <span className="text-xs text-muted-foreground">
              {isTwoFactorEnabled
                ? t("twoFactorEnabledDesc")
                : t("twoFactorDisabledDesc")}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 tablet-sm:justify-end">
          {isTwoFactorEnabled ? (
            <Badge className="border border-brand/15 bg-brand-soft text-[10px] text-brand hover:bg-brand-soft">
              {t("enabled")}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] text-muted-foreground"
            >
              {t("disabled")}
            </Badge>
          )}
          <Button
            size="sm"
            variant={isTwoFactorEnabled ? "outline" : "default"}
            className="h-9 shrink-0 rounded-xl px-3 text-xs"
            onClick={onToggleTwoFactor}
          >
            {isTwoFactorEnabled ? t("disable") : t("enable")}
          </Button>
        </div>
      </div>
      <Separator />

      {/* Last Login Section */}
      <SettingRow
        icon={<LucideLogIn />}
        label={t("lastLogin")}
        value={lastLogin}
      />

      {/* Member Since Section */}
      <SettingRow
        icon={<LucideInfo />}
        label={t("memberSince")}
        value={memberSince}
      />

      {/* Reset Password Section */}
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 tablet-sm:flex-col tablet-sm:items-stretch">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/55 text-muted-foreground [&>svg]:size-4">
            <LucideKeyRound />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{t("resetPassword")}</span>
            <span className="text-xs text-muted-foreground">
              {t("sendResetLinkDesc")}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-9 shrink-0 rounded-xl px-3 text-xs tablet-sm:self-end"
          onClick={onResetPassword}
        >
          {t("reset")}
        </Button>
      </div>
    </SettingWrapper>
  );
}
