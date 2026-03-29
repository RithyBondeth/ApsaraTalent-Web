import React from "react";
import { cn } from "@/lib/utils";
import { LucideCheck, LucideGlobe } from "lucide-react";
import { SettingWrapper } from "../setting-wrapper/setting-wrapper";
import { ILanguageCardProps, ILanguageSectionProps } from "./props";

export function LanguageSection(props: ILanguageSectionProps) {
  /* -------------------------------- Props -------------------------------- */
  const { language, onLanguageChange } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <SettingWrapper
      icon={<LucideGlobe />}
      title="Language"
      description="Select the language used throughout the app"
    >
      <div className="flex flex-col gap-3 p-4">
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
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer w-full text-left",
        active
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {/* Flag Section */}
      <span className="text-2xl shrink-0">{flag}</span>

      {/* Label Section */}
      <div className="flex flex-col flex-1 min-w-0">
        <span
          className={cn("text-sm font-semibold", active ? "text-primary" : "")}
        >
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{nativeLabel}</span>
      </div>

      {/* Active Checkmark Section */}
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
