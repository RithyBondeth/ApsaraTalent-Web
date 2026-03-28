import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import React from "react";
import {
  LucideMonitor,
  LucideMoon,
  LucidePalette,
  LucideSun,
} from "lucide-react";
import { ThemeCard } from "./theme-card";
import { SettingWrapper } from "../setting-wrapper/setting-wrapper";
import { IAppearanceSectionProps } from "./props";

export function AppearanceSection(props: IAppearanceSectionProps) {
  const { theme, onThemeChange } = props;

  return (
    <SettingWrapper
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
            onClick={() => onThemeChange("light")}
          />
          <ThemeCard
            value="dark"
            label="Dark"
            icon={<LucideMoon />}
            active={theme === "dark"}
            onClick={() => onThemeChange("dark")}
          />
          <ThemeCard
            value="system"
            label="System"
            icon={<LucideMonitor />}
            active={theme === "system"}
            onClick={() => onThemeChange("system")}
          />
        </div>
        <TypographyMuted className="text-xs text-center">
          {theme === "system"
            ? "Follows your device's system preference"
            : `Using ${theme} mode`}
        </TypographyMuted>
      </div>
    </SettingWrapper>
  );
}
