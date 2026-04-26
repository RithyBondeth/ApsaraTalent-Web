"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LucideInfo, LucideShieldCheck } from "lucide-react";
import { SettingWrapper } from "../setting-wrapper";
import { SettingRow } from "../setting-row";
import { useTranslations } from "next-intl";

export function AboutSection() {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideInfo />}
      title={t("about")}
      description={t("aboutDescription")}
    >
      {/* Version Section */}
      <SettingRow
        icon={<LucideInfo />}
        label={t("version")}
        value={
          <Badge variant="secondary" className="text-[10px] font-mono">
            v1.0.0
          </Badge>
        }
      />

      {/* Privacy Policy Section */}
      <SettingRow
        icon={<LucideShieldCheck />}
        label={t("privacyPolicy")}
        value={
          <Link
            href="/privacy"
            className="text-xs text-primary hover:underline"
          >
            {t("view")}
          </Link>
        }
      />

      {/* Terms of Service Section */}
      <SettingRow
        icon={<LucideInfo />}
        label={t("termsOfService")}
        value={
          <Link href="/terms" className="text-xs text-primary hover:underline">
            {t("view")}
          </Link>
        }
        last
      />
    </SettingWrapper>
  );
}
