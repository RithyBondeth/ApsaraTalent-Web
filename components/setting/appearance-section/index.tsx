"use client";

import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React from "react";
import {
  LucideMonitor,
  LucideMoon,
  LucidePalette,
  LucideSun,
} from "lucide-react";
import { ThemeCard } from "./theme-card";
import { SettingWrapper } from "../setting-wrapper";
import { IAppearanceSectionProps } from "./props";
import { useTranslations } from "next-intl";

export function AppearanceSection(props: IAppearanceSectionProps) {
  /* --------------------------------- Props --------------------------------- */
  const { theme, onThemeChange } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* ---------------------------------- Utils --------------------------------- */
  const themeLabel: Record<string, string> = {
    light: t("themeLight"),
    dark: t("themeDark"),
    system: t("themeSystem"),
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucidePalette />}
      title={t("appearance")}
      description={t("appearanceDescription")}
    >
      {/* Theme Section */}
      <div className="flex flex-col gap-4 p-4">
        {/* Theme Cards List Section */}
        <div className="grid grid-cols-3 gap-3">
          <ThemeCard
            value="light"
            label={t("themeLight")}
            icon={<LucideSun />}
            active={theme === "light"}
            onClick={() => onThemeChange("light")}
          />
          <ThemeCard
            value="dark"
            label={t("themeDark")}
            icon={<LucideMoon />}
            active={theme === "dark"}
            onClick={() => onThemeChange("dark")}
          />
          <ThemeCard
            value="system"
            label={t("themeSystem")}
            icon={<LucideMonitor />}
            active={theme === "system"}
            onClick={() => onThemeChange("system")}
          />
        </div>
        {/* Theme Description Section */}
        <TypographyMuted className="text-center text-xs">
          {theme === "system"
            ? t("followsSystem")
            : t("usingMode", { theme: themeLabel[theme] ?? theme })}
        </TypographyMuted>
      </div>
    </SettingWrapper>
  );
}
