"use client";

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
import { SettingWrapper } from "../setting-wrapper/setting-wrapper";
import { SettingRow } from "../setting-row";
import { IAccountSectionProps } from "./props";

export function AccountSection({
  displayName,
  avatarSrc,
  email,
  role,
  isTwoFactorEnabled,
  lastLogin,
  memberSince,
  onResetPassword,
}: IAccountSectionProps) {
  return (
    <SettingWrapper
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
            {email ?? "—"}
          </p>
          <Badge
            variant="secondary"
            className="w-fit mt-0.5 text-[10px] capitalize"
          >
            {role ?? "—"}
          </Badge>
        </div>
      </div>
      <Separator />

      <SettingRow icon={<LucideMail />} label="Email" value={email ?? "—"} />
      <SettingRow
        icon={<LucideShieldCheck />}
        label="Two-Factor Auth"
        value={
          isTwoFactorEnabled ? (
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
      <SettingRow icon={<LucideLogIn />} label="Last Login" value={lastLogin} />
      <SettingRow
        icon={<LucideInfo />}
        label="Member Since"
        value={memberSince}
      />

      {/* Reset Password row */}
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
          onClick={onResetPassword}
        >
          Reset
        </Button>
      </div>
    </SettingWrapper>
  );
}
