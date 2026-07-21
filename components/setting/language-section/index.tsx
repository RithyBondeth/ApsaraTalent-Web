"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LucideCheck, LucideGlobe } from "lucide-react";
import { SettingWrapper } from "../setting-wrapper";
import { ILanguageCardProps, ILanguageSectionProps } from "./props";
import { useTranslations } from "next-intl";

export function LanguageSection(props: ILanguageSectionProps) {
  /* -------------------------------- Props -------------------------------- */
  const { language, onLanguageChange } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("setting");

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideGlobe />}
      title={t("language")}
      description={t("languageDescription")}
    >
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        {/* English Language Card Section */}
        <LanguageCard
          value="en"
          flag="🇬🇧"
          label="English"
          nativeLabel="English"
          active={language === "en"}
          onClick={() => onLanguageChange("en")}
        />

        {/* Khmer Language Card Section */}
        <LanguageCard
          value="km"
          flag="🇰🇭"
          label="Khmer"
          nativeLabel="ភាសាខ្មែរ"
          active={language === "km"}
          onClick={() => onLanguageChange("km")}
        />
      </div>
    </SettingWrapper>
  );
}

function LanguageCard(props: ILanguageCardProps) {
  /* -------------------------------- Props -------------------------------- */
  const { flag, label, nativeLabel, active, onClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors duration-200",
        active
          ? "border-brand/35 bg-brand-soft/70 shadow-[0_0_0_1px_hsl(var(--brand)/0.08)]"
          : "border-border/70 bg-background/50 hover:border-brand/20 hover:bg-muted/35",
      )}
    >
      {/* Flag Section */}
      <span className="text-2xl shrink-0">{flag}</span>

      {/* Label Section */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={cn("text-sm font-semibold", active ? "text-brand" : "")}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{nativeLabel}</span>
      </div>

      {/* Active Checkmark Section */}
      {active && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand">
          <LucideCheck
            className="size-3 text-brand-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}
