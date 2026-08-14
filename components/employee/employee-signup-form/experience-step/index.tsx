import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucidePlus, LucideTrash2, Sparkles, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { IStepFormProps } from "../props";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import { toast } from "sonner";

export default function ExperienceStepForm({
  register,
  control,
  errors,
  setValue,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tr = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------ */
  const initializedRef = useRef<boolean>(false);

  /* ------------------------------ AI Integration ---------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* ------------------------------ React Hook Form --------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const experienceValues = useWatch({ control, name: "experience" });

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      append({
        title: "",
        company: "",
        description: "",
        startDate: "" as unknown as Date,
        endDate: "" as unknown as Date,
      });
    }
  }, [append, fields.length]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Experience ─────────────────────────────────────────
  const addExperience = () => {
    append({
      title: "",
      company: "",
      description: "",
      startDate: "" as unknown as Date,
      endDate: "" as unknown as Date,
    });
  };

  // ── Refine Experience ─────────────────────────────────────────
  const handleRefine = async (index: number) => {
    const desc = experienceValues[index]?.description;
    const result = await refineContent(desc, "experience");
    if (result && typeof result === "string" && setValue) {
      setValue(`experience.${index}.description`, result, {
        shouldDirty: true,
      });
      toast.success(tr("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex max-h-[500px] w-full flex-col gap-5 overflow-y-auto pr-1">
      {/* Title Section */}
      <TypographyH4>{t("empExperienceTitle")}</TypographyH4>

      {/* Experience Form Section */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative flex w-full flex-col items-start gap-3 rounded-none border border-l-[5px] border-border border-l-foreground bg-muted p-5"
        >
          {/* Header Without Remove Button Section */}
          {fields.length === 1 && (
            <div className="mb-3 w-full">
              <TypographyMuted className="text-md font-bold text-foreground">
                {t("empExperienceLabel")} {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button Section */}
          {fields.length > 1 && (
            <div className="mb-3 flex w-full items-center justify-between">
              <TypographyMuted className="text-md font-bold text-foreground">
                {t("empExperienceLabel")} {index + 1}
              </TypographyMuted>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => remove(index)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LucideTrash2 size={16} />
              </Button>
            </div>
          )}

          {/* Title Section */}
          <LabelInput
            label={t("empExperienceFieldTitle")}
            input={
              <Input
                placeholder={t("empExperienceTitlePlaceholder")}
                {...register(`experience.${index}.title`)}
                validationMessage={errors?.experience?.[index]?.title?.message}
              />
            }
          />

          <LabelInput
            label={t("empExperienceCompany")}
            input={
              <Input
                placeholder={t("empExperienceCompanyPlaceholder")}
                {...register(`experience.${index}.company`)}
                validationMessage={
                  errors?.experience?.[index]?.company?.message
                }
              />
            }
          />

          {/* Description Section */}
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between">
              <TypographyMuted className="text-xs">
                {t("empExperienceDescription")}
              </TypographyMuted>
              {experienceValues?.[index]?.description && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRefine(index)}
                  disabled={isRefining}
                  className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                >
                  {isRefining ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : (
                    <Sparkles size={10} />
                  )}
                  {tr("aiRefine")}
                </Button>
              )}
            </div>
            <Textarea
              autoResize
              placeholder={t("empExperienceDescriptionPlaceholder")}
              className="placeholder:text-sm"
              {...register(`experience.${index}.description`)}
              validationMessage={
                errors?.experience?.[index]?.description?.message
              }
            />
          </div>

          {/* StartDate and EndDate Section */}
          <div className="flex w-full items-center gap-4">
            {/* StartDate Section */}
            <div className="flex w-full flex-col gap-1">
              <TypographyMuted className="text-xs">
                {t("empExperienceStartDate")}
              </TypographyMuted>
              <Controller
                control={control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                  <DatePicker
                    placeholder={t("empExperienceStartDatePlaceholder")}
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date ? new Date(date) : "")
                    }
                  />
                )}
              />
              <ErrorMessage>
                {errors?.experience?.[index]?.startDate?.message}
              </ErrorMessage>
            </div>

            {/* EndDate Section */}
            <div className="flex w-full flex-col gap-1">
              <TypographyMuted className="text-xs">
                {t("empExperienceEndDate")}
              </TypographyMuted>
              <Controller
                control={control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <DatePicker
                    placeholder={t("empExperienceEndDatePlaceholder")}
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date ? new Date(date) : "")
                    }
                  />
                )}
              />
              <ErrorMessage>
                {errors?.experience?.[index]?.endDate?.message}
              </ErrorMessage>
            </div>
          </div>
        </div>
      ))}

      {/* Add More Button Section */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          className="text-xs"
          type="button"
          onClick={addExperience}
        >
          {t("addMore")}
          <LucidePlus className="ml-1" size={16} />
        </Button>
      </div>
    </div>
  );
}
