import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWatch } from "react-hook-form";
import { useState } from "react";
import { IFormPanelProps } from "../props";
import { FieldLabel } from "./field-label";
import { useTranslations } from "next-intl";
import { Sparkles, Loader2, Wand2 } from "lucide-react";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import { toast } from "sonner";

export function SkillsEducationTab({
  register,
  control,
  setValue,
}: IFormPanelProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------- */
  const [newSkill, setNewSkill] = useState<string>("");
  const [newScope, setNewScope] = useState<string>("");

  /* ----------------------------- React Hook Form ---------------------------- */
  const skills = (useWatch({ control, name: "skills" }) ?? []) as string[];
  const careerScopes = (useWatch({ control, name: "careerScopes" }) ??
    []) as string[];
  const jobTitle = useWatch({ control, name: "personalInfo.job" }) ?? "";
  const education = useWatch({ control, name: "education" }) ?? "";

  /* ---------------------------- API Integration ---------------------------- */
  const { isRefining: skillsLoading, refineContent: suggestSkills } =
    useAIRefine();
  const { isRefining: eduLoading, refineContent: refineEdu } = useAIRefine();

  /* --------------------------------- Methods ------------------------------- */
  // ── Add Skill ───────────────────────────────────────────
  const addSkill = (val?: string) => {
    const trimmed = (val ?? newSkill).trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;
    setValue("skills", [...skills, trimmed], { shouldDirty: true });
    if (!val) setNewSkill("");
  };

  // ── Remove Skill ─────────────────────────────────────────
  const removeSkill = (i: number) => {
    setValue(
      "skills",
      skills.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  // ── Add Career Scope ───────────────────────────────────────
  const addScope = () => {
    const trimmed = newScope.trim();
    if (!trimmed) return;
    setValue("careerScopes", [...careerScopes, trimmed], {
      shouldDirty: true,
    });
    setNewScope("");
  };

  // ── Remove Career Scope ─────────────────────────────────────
  const removeScope = (i: number) => {
    setValue(
      "careerScopes",
      careerScopes.filter((_, idx) => idx !== i),
      { shouldDirty: true },
    );
  };

  // ── Handle Suggest Skills ───────────────────────────────────
  const handleSuggestSkills = async () => {
    const results = await suggestSkills(jobTitle as string, "skills", {
      jobTitle: jobTitle as string,
    });
    if (results && typeof results === "string") {
      const suggested = results
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const nextSkills = [...new Set([...skills, ...suggested])];
      setValue("skills", nextSkills, { shouldDirty: true });
      toast.success(t("skillsSuggested"));
    }
  };

  // ── Handle Education Standardize ──────────────────────────────
  const handleEduStandardize = async () => {
    const result = await refineEdu(education, "education");
    if (result && typeof result === "string") {
      setValue("education", result, { shouldDirty: true });
      toast.success(t("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* Skills Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLabel>{t("skills")}</FieldLabel>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSuggestSkills}
            disabled={skillsLoading}
            className="h-6 gap-1 px-1.5 text-[9px] text-brand hover:bg-brand-soft hover:text-brand"
          >
            {skillsLoading ? (
              <Loader2 size={10} className="animate-spin" />
            ) : (
              <Sparkles size={10} />
            )}
            {t("suggest")}
          </Button>
        </div>

        {/* Skills List Section */}
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full border border-brand/20 bg-brand-soft px-2 py-0.5 text-[11px] text-brand-soft-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="ml-0.5 text-brand/70 transition-colors hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <span className="text-[11px] text-muted-foreground italic">
              {t("noSkillsAdded")}
            </span>
          )}
        </div>

        {/* Skills Input Section */}
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Input
            placeholder={t("addSkill")}
            value={newSkill}
            className="h-8 text-xs"
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => addSkill()}
            className="h-8 text-xs sm:min-w-16 lg:min-w-0 xl:min-w-16"
          >
            {t("add")}
          </Button>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Education Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <FieldLabel>{t("education")}</FieldLabel>
          {education && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleEduStandardize}
              disabled={eduLoading}
              className="h-6 gap-1 px-1.5 text-[9px] text-brand hover:bg-brand-soft hover:text-brand"
            >
              {eduLoading ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Wand2 size={10} />
              )}
              {t("polish")}
            </Button>
          )}
        </div>
        <Textarea
          autoResize
          placeholder={t("educationExample")}
          className="min-h-[80px] text-xs leading-relaxed"
          {...register("education")}
        />
        <TypographyMuted className="text-[10px] mt-1 pl-1">
          {t("separateDegrees")}{" "}
          <code className="text-[10px] bg-muted px-1 rounded font-bold">|</code>
        </TypographyMuted>
      </div>

      <Separator className="opacity-50" />

      {/* Career Scopes Section */}
      <div className="space-y-2">
        <FieldLabel>{t("careerInterests")}</FieldLabel>
        {/* Career Scopes List Section */}
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          {careerScopes.map((scope, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[11px] px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50"
            >
              {scope}
              <button
                type="button"
                onClick={() => removeScope(i)}
                className="text-emerald-500 hover:text-destructive transition-colors ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
          {careerScopes.length === 0 && (
            <span className="text-[11px] text-muted-foreground italic">
              {t("noInterestsAdded")}
            </span>
          )}
        </div>
        {/* Career Scopes Input Section */}
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Input
            placeholder={t("addCareerInterest")}
            value={newScope}
            className="h-8 text-xs"
            onChange={(e) => setNewScope(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addScope();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addScope}
            className="h-8 text-xs sm:min-w-16 lg:min-w-0 xl:min-w-16"
          >
            {t("add")}
          </Button>
        </div>
      </div>
    </div>
  );
}
