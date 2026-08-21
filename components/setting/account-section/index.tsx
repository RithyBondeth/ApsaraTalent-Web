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
      <div className="flex items-center gap-4 bg-muted/30 px-4 py-5 sm:px-5">
        <Avatar className="size-14 shrink-0 rounded-none border border-border">
          <AvatarImage src={avatarSrc} alt={displayName} />
          <AvatarFallback className="rounded-none text-base font-black">
            {getNameInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <TypographySmall className="block truncate font-semibold leading-none">
            {displayName}
          </TypographySmall>
          <TypographyMuted className="truncate text-xs">
            {email ?? "—"}
          </TypographyMuted>
          <Badge
            variant="secondary"
            className="mt-0.5 w-fit rounded-none text-[10px] font-bold uppercase tracking-wider"
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
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-foreground [&>svg]:size-4">
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
        <div className="flex shrink-0 items-stretch gap-2 pl-11 sm:pl-0">
          {isTwoFactorEnabled ? (
            <Badge className="rounded-none border border-emerald-300/40 bg-emerald-500/10 text-[10px] text-emerald-600 hover:bg-emerald-500/10">
              {t("enabled")}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="rounded-none text-[10px] text-muted-foreground"
            >
              {t("disabled")}
            </Badge>
          )}
          <Button
            size="sm"
            variant={isTwoFactorEnabled ? "outline" : "default"}
            className="shrink-0 rounded-none text-xs"
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
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center bg-muted text-foreground [&>svg]:size-4">
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
          className="ml-11 shrink-0 self-start rounded-none text-xs sm:ml-0 sm:self-auto"
          onClick={onResetPassword}
        >
          {t("reset")}
        </Button>
      </div>
    </SettingWrapper>
  );
}
