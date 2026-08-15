"use client";

import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  LucideDices,
  LucidePipette,
  LucideRotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { FieldLabel } from "./field-label";
import { cn } from "@/lib/utils";
import {
  IBuildResume,
  IResumeDesign,
} from "@/utils/interfaces/resume/resume.interface";
import {
  buildTemplateBaseDesign,
  shuffleResumeDesign,
  RESUME_DESIGN_OPTIONS,
} from "@/utils/functions/resume";
import {
  DESIGN_FONTS,
  DESIGN_PALETTES,
} from "@/utils/constants/resume-theme.constant";

/* --------------------------------- Helpers --------------------------------- */
function humanize(value: string): string {
  return value.replace(/-/g, " ");
}

function PillGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onSelect: (next: T) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={cn(
              "rounded-none border px-2.5 py-1 text-[11px] capitalize transition-colors",
              option === value
                ? "border-primary bg-primary/10 font-medium text-primary"
                : "border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {humanize(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function AdvancedDesignSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Collapsible className="border border-border">
      {/* Collapsible Triggrer Section */}
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 bg-muted/25 px-3 py-3 text-left transition-colors hover:bg-muted/50">
        <span>
          <span className="block text-xs font-medium text-foreground">
            {title}
          </span>
          <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
            {description}
          </span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>

      {/* Collapsible Content Section */}
      <CollapsibleContent className="border-t border-border">
        <div className="flex flex-col gap-5 p-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function DesignTab({
  control,
  setValue,
}: {
  control: Control<IBuildResume>;
  setValue: UseFormSetValue<IBuildResume>;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------ */
  const design = useWatch({ control, name: "design" });
  const template = useWatch({ control, name: "template" });
  const activeDesign = design ?? buildTemplateBaseDesign(template ?? "modern");
  const isCustomized = Boolean(design);

  /* --------------------------------- Methods --------------------------------- */
  // ── Apply Design ──────────────────────────────────────────────────
  const applyDesign = (next: IResumeDesign) =>
    setValue("design", next, { shouldDirty: true });

  // ── Apply Field ───────────────────────────────────────────────────
  const applyField = <K extends keyof IResumeDesign>(
    field: K,
    value: IResumeDesign[K],
  ) => applyDesign({ ...activeDesign, [field]: value });

  // ── Toggle Sidebar Section ────────────────────────────────────────
  const toggleSidebarSection = (
    section: IResumeDesign["sidebarSections"][number],
  ) => {
    const current = activeDesign.sidebarSections;
    const next = current.includes(section)
      ? current.filter((item) => item !== section)
      : [...current, section];
    if (next.length === 0) return; // canvas needs at least one sidebar section
    applyField("sidebarSections", next);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Actions Section */}
      <div className="flex items-center justify-between gap-2">
        <TypographyMuted className="!text-[11px] leading-snug">
          {isCustomized
            ? t("designCustomized")
            : t("designUsingTemplateDefault")}
        </TypographyMuted>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-none px-2.5 text-xs"
            onClick={() => applyDesign(shuffleResumeDesign())}
          >
            <LucideDices size={13} />
            {t("designShuffle")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 rounded-none px-2.5 text-xs text-muted-foreground"
            disabled={!isCustomized}
            onClick={() => setValue("design", undefined, { shouldDirty: true })}
          >
            <LucideRotateCcw size={13} />
            {t("designReset")}
          </Button>
        </div>
      </div>

      {/* Palette Section */}
      <div>
        <FieldLabel>{t("designPalette")}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {RESUME_DESIGN_OPTIONS.palette.map((palette) => {
            const colors = DESIGN_PALETTES[palette];
            const selected =
              activeDesign.palette === palette && !activeDesign.customAccent;
            return (
              <button
                key={palette}
                type="button"
                title={humanize(palette)}
                aria-label={humanize(palette)}
                aria-pressed={selected}
                onClick={() =>
                  // Picking a named palette always exits custom-color mode
                  applyDesign({
                    ...activeDesign,
                    palette,
                    customAccent: undefined,
                  })
                }
                className={cn(
                  "size-8 rounded-none border transition-all",
                  selected
                    ? "scale-105 border-transparent ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "border-border/60 hover:scale-105",
                )}
                style={{
                  background: `linear-gradient(135deg, ${colors.header} 50%, ${colors.accent} 50%)`,
                }}
              />
            );
          })}
        </div>

        {/* Custom Color Section */}
        <div className="mt-2.5 flex items-center gap-2">
          <label
            className={cn(
              "relative flex cursor-pointer items-center gap-2 rounded-none border px-2.5 py-1.5 transition-colors",
              activeDesign.customAccent
                ? "border-primary bg-primary/10"
                : "border-border/70 bg-card hover:border-border",
            )}
          >
            <input
              type="color"
              value={
                activeDesign.customAccent ??
                DESIGN_PALETTES[activeDesign.palette].accent
              }
              onChange={(event) =>
                applyField("customAccent", event.target.value)
              }
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label={t("designCustomColor")}
            />
            <LucidePipette
              size={12}
              className={
                activeDesign.customAccent
                  ? "text-primary"
                  : "text-muted-foreground"
              }
            />
            <span
              aria-hidden
              className="size-4 rounded-none border border-border/60"
              style={{
                background:
                  activeDesign.customAccent ??
                  DESIGN_PALETTES[activeDesign.palette].accent,
              }}
            />
            <span
              className={cn(
                "pixel-numeral text-[11px] font-medium",
                activeDesign.customAccent
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {activeDesign.customAccent?.toUpperCase() ??
                t("designCustomColor")}
            </span>
          </label>
          {activeDesign.customAccent && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 rounded-none px-2 text-[11px] text-muted-foreground"
              onClick={() => applyField("customAccent", undefined)}
            >
              {t("designCustomColorClear")}
            </Button>
          )}
        </div>
      </div>

      {/* Typography Section */}
      <div>
        <FieldLabel>{t("designTypography")}</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {RESUME_DESIGN_OPTIONS.typography.map((typography) => {
            const selected = activeDesign.typography === typography;
            return (
              <button
                key={typography}
                type="button"
                aria-pressed={selected}
                onClick={() => applyField("typography", typography)}
                className={cn(
                  "flex min-w-[52px] flex-col items-center gap-0.5 rounded-none border px-2 py-1.5 transition-colors",
                  selected
                    ? "border-primary bg-primary/10"
                    : "border-border/70 bg-card hover:border-border",
                )}
              >
                <span
                  className={cn(
                    "text-base leading-none",
                    selected ? "text-primary" : "text-foreground",
                  )}
                  style={{ fontFamily: DESIGN_FONTS[typography] }}
                >
                  Ag
                </span>
                <span className="text-[10px] capitalize text-muted-foreground">
                  {typography}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Density Section */}
      <PillGroup
        label={t("designDensity")}
        options={RESUME_DESIGN_OPTIONS.density}
        value={activeDesign.density}
        onSelect={(value) => applyField("density", value)}
      />

      {/* Advanced Layout Section */}
      <AdvancedDesignSection
        title={t("designAdvancedLayout")}
        description={t("designAdvancedLayoutDescription")}
      >
        <PillGroup
          label={t("designLayout")}
          options={RESUME_DESIGN_OPTIONS.layout}
          value={activeDesign.layout}
          onSelect={(value) => applyField("layout", value)}
        />
        {activeDesign.layout !== "single" && (
          <>
            <PillGroup
              label={t("designColumnRatio")}
              options={RESUME_DESIGN_OPTIONS.columnRatio}
              value={activeDesign.columnRatio}
              onSelect={(value) => applyField("columnRatio", value)}
            />
            <div>
              <FieldLabel>{t("designSidebarSections")}</FieldLabel>
              <div className="flex flex-wrap gap-1.5">
                {RESUME_DESIGN_OPTIONS.sidebarSections.map((section) => {
                  const selected =
                    activeDesign.sidebarSections.includes(section);
                  return (
                    <button
                      key={section}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleSidebarSection(section)}
                      className={cn(
                        "rounded-none border px-2.5 py-1 text-[11px] capitalize transition-colors",
                        selected
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                      )}
                    >
                      {humanize(section)}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <PillGroup
          label={t("designHeaderLayout")}
          options={RESUME_DESIGN_OPTIONS.headerLayout}
          value={activeDesign.headerLayout}
          onSelect={(value) => applyField("headerLayout", value)}
        />
        <PillGroup
          label={t("designHeaderStyle")}
          options={RESUME_DESIGN_OPTIONS.headerStyle}
          value={activeDesign.headerStyle}
          onSelect={(value) => applyField("headerStyle", value)}
        />
        <PillGroup
          label={t("designAvatarPlacement")}
          options={RESUME_DESIGN_OPTIONS.avatarPlacement}
          value={activeDesign.avatarPlacement}
          onSelect={(value) => applyField("avatarPlacement", value)}
        />
      </AdvancedDesignSection>

      {/* Advanced Section Styling */}
      <AdvancedDesignSection
        title={t("designAdvancedDetails")}
        description={t("designAdvancedDetailsDescription")}
      >
        <PillGroup
          label={t("designSectionStyle")}
          options={RESUME_DESIGN_OPTIONS.sectionStyle}
          value={activeDesign.sectionStyle}
          onSelect={(value) => applyField("sectionStyle", value)}
        />
        <PillGroup
          label={t("designCornerStyle")}
          options={RESUME_DESIGN_OPTIONS.cornerStyle}
          value={activeDesign.cornerStyle}
          onSelect={(value) => applyField("cornerStyle", value)}
        />
        <PillGroup
          label={t("designDecoration")}
          options={RESUME_DESIGN_OPTIONS.decoration}
          value={activeDesign.decoration}
          onSelect={(value) => applyField("decoration", value)}
        />
        <PillGroup
          label={t("designExperienceStyle")}
          options={RESUME_DESIGN_OPTIONS.experienceStyle}
          value={activeDesign.experienceStyle}
          onSelect={(value) => applyField("experienceStyle", value)}
        />
        <PillGroup
          label={t("designSkillsStyle")}
          options={RESUME_DESIGN_OPTIONS.skillsStyle}
          value={activeDesign.skillsStyle}
          onSelect={(value) => applyField("skillsStyle", value)}
        />
        <PillGroup
          label={t("designEducationStyle")}
          options={RESUME_DESIGN_OPTIONS.educationStyle}
          value={activeDesign.educationStyle}
          onSelect={(value) => applyField("educationStyle", value)}
        />
        <PillGroup
          label={t("designSummaryStyle")}
          options={RESUME_DESIGN_OPTIONS.summaryStyle}
          value={activeDesign.summaryStyle}
          onSelect={(value) => applyField("summaryStyle", value)}
        />
      </AdvancedDesignSection>
    </div>
  );
}
