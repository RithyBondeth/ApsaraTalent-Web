import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { IExperience as Experience } from "@/utils/interfaces/resume/resume.interface";
import {
  UseFormRegister,
  Control,
  useFieldArray,
  useWatch,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import {
  LucidePlusCircle,
  LucideTrash2,
  LucideChevronDown,
  LucideChevronUp,
  LucideSparkles,
  LucideLoader2,
} from "lucide-react";
import { useState } from "react";
import { FieldLabel } from "./field-label";
import { useTranslations } from "next-intl";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import { toast } from "sonner";

export function ExperienceCard({
  index,
  register,
  control,
  onRemove,
  showRemove,
  setValue,
}: {
  index: number;
  register: UseFormRegister<IBuildResume>;
  control: Control<IBuildResume>;
  onRemove: () => void;
  showRemove: boolean;
  setValue: UseFormSetValue<IBuildResume>;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");
  // Achievements nested field array
  const achPath = `experience.${index}.achievements` as Path<IBuildResume>;

  /* -------------------------------- All States ------------------------------ */
  const [open, setOpen] = useState<boolean>(true);

  /* -------------------------------- API Integration ------------------------- */
  const { isRefining: descLoading, refineContent: refineDesc } = useAIRefine();
  const { isRefining: achLoading, refineContent: refineAch } = useAIRefine();

  /* ----------------------------- React Hook Form ---------------------------- */
  const position = useWatch({
    control,
    name: `experience.${index}.position` as Path<IBuildResume>,
  });
  const description = useWatch({
    control,
    name: `experience.${index}.description` as Path<IBuildResume>,
  });
  const achievements = useWatch({
    control,
    name: `experience.${index}.achievements` as Path<IBuildResume>,
  }) as string[];

  const {
    fields: achFields,
    append: achAppend,
    remove: achRemove,
  } = useFieldArray({ control, name: achPath as "experience" });

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Description Refine ───────────────
  const handleDescRefine = async () => {
    const result = await refineDesc(description as string, "experience");
    if (result && typeof result === "string") {
      setValue(
        `experience.${index}.description` as Path<IBuildResume>,
        result,
        { shouldDirty: true },
      );
      toast.success(t("refinedSuccess"));
    }
  };

  // ── Handle Achievement Refine ───────────────
  const handleAchRefine = async (ai: number) => {
    const achValue = achievements[ai];
    const result = await refineAch(achValue, "achievement");
    if (result && typeof result === "string") {
      setValue(
        `experience.${index}.achievements.${ai}` as Path<IBuildResume>,
        result,
        { shouldDirty: true },
      );
      toast.success(t("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="overflow-hidden rounded-none border border-l-[5px] border-border border-l-foreground bg-background shadow-hard">
      {/* Card Header Section */}
      <div
        className="flex cursor-pointer select-none items-center justify-between border-b border-border/40 bg-muted/30 px-3 py-2"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Card Header Title Section */}
        <span className="truncate text-xs font-bold uppercase tracking-tight text-muted-foreground/80">
          {(position as string) || `${t("experience")} ${index + 1}`}
        </span>

        {/* Card Header Actions Section */}
        <div className="ml-2 flex shrink-0 items-center gap-1">
          {showRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LucideTrash2 size={13} />
            </button>
          )}
          {open ? (
            <LucideChevronUp size={14} className="text-muted-foreground" />
          ) : (
            <LucideChevronDown size={14} className="text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Card Body Section */}
      {open && (
        <div className="flex flex-col gap-3.5 p-3">
          {/* Position and Company Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <FieldLabel>{t("positionRole")}</FieldLabel>
              <Input
                placeholder={t("softwareEngineerPlaceholder")}
                {...register(`experience.${index}.position`)}
              />
            </div>
            <div>
              <FieldLabel>{t("company")}</FieldLabel>
              <Input
                placeholder={t("companyNamePlaceholder")}
                {...register(`experience.${index}.company`)}
              />
            </div>
          </div>

          {/* Start and End Date Section */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <FieldLabel>{t("startDate")}</FieldLabel>
              <Input
                placeholder={t("monthYearPlaceholder")}
                {...register(`experience.${index}.startDate`)}
              />
            </div>
            <div>
              <FieldLabel>{t("endDate")}</FieldLabel>
              <Input
                placeholder={t("presentPlaceholder")}
                {...register(`experience.${index}.endDate`)}
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <FieldLabel>{t("description")}</FieldLabel>
              {description && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDescRefine}
                  disabled={descLoading}
                  className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                >
                  {descLoading ? (
                    <LucideLoader2 size={10} className="animate-spin" />
                  ) : (
                    <LucideSparkles size={10} />
                  )}
                  {t("aiRefine")}
                </Button>
              )}
            </div>
            <Textarea
              autoResize
              placeholder={t("briefRolePlaceholder")}
              className="min-h-[70px] text-xs"
              {...register(`experience.${index}.description`)}
            />
          </div>

          {/* Achievements Section */}
          <div className="space-y-2">
            {/* Achievements Header Section */}
            <div className="flex items-center justify-between">
              <FieldLabel>{t("keyAchievements")}</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-primary"
                onClick={() => achAppend("" as unknown as Experience)}
              >
                <LucidePlusCircle size={11} className="mr-1" /> {t("add")}
              </Button>
            </div>

            {/* Achievements List Section */}
            <div className="flex flex-col gap-2">
              {achFields.map((f, ai) => (
                <div
                  key={f.id}
                  className="group/ach flex flex-col gap-1.5 rounded-none border border-l-[4px] border-border border-l-foreground bg-muted/20 p-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      {t("achievementNumber", { number: ai + 1 })}
                    </span>
                    <div className="flex items-center gap-1">
                      {achievements?.[ai] && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAchRefine(ai)}
                          disabled={achLoading}
                          className="h-5 gap-1 px-1.5 text-[8px] text-primary hover:bg-primary/10 hover:text-primary"
                        >
                          {achLoading ? (
                            <LucideLoader2 size={9} className="animate-spin" />
                          ) : (
                            <LucideSparkles size={9} />
                          )}
                          {t("refine")}
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => achRemove(ai)}
                        className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <LucideTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <Input
                    placeholder={t("achievementPlaceholder")}
                    className="h-8 bg-background text-xs"
                    {...register(
                      `experience.${index}.achievements.${ai}` as Path<IBuildResume>,
                    )}
                  />
                </div>
              ))}
              {achFields.length === 0 && (
                <TypographyMuted className="pl-1 text-[11px] italic">
                  {t("noAchievementsAdded")}
                </TypographyMuted>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
