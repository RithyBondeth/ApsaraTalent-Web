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
            className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
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
        <div className="mb-2 flex min-h-[28px] flex-wrap gap-1.5">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-none border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] text-primary"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="ml-0.5 text-primary/60 transition-colors hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
          {skills.length === 0 && (
            <span className="text-[11px] italic text-muted-foreground">
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
              className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
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
        <TypographyMuted className="mt-1 pl-1 text-[10px]">
          {t("separateDegrees")}{" "}
          <code className="rounded bg-muted px-1 text-[10px] font-medium">
            |
          </code>
        </TypographyMuted>
      </div>

      <Separator className="opacity-50" />

      {/* Career Scopes Section */}
      <div className="space-y-2">
        <FieldLabel>{t("careerInterests")}</FieldLabel>
        {/* Career Scopes List Section */}
        <div className="mb-2 flex min-h-[28px] flex-wrap gap-1.5">
          {careerScopes.map((scope, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-none border border-success-border bg-success-subtle px-2 py-0.5 text-[11px] text-success-accent"
            >
              {scope}
              <button
                type="button"
                onClick={() => removeScope(i)}
                className="ml-0.5 text-success transition-colors hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
          {careerScopes.length === 0 && (
            <span className="text-[11px] italic text-muted-foreground">
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
