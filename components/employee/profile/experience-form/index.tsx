"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideBriefcaseBusiness,
  LucideTrash2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { IEmployeeExperienceFormProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useTranslations } from "next-intl";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import { toast } from "sonner";

export default function EmployeeExperienceForm(
  props: IEmployeeExperienceFormProps,
) {
  /* --------------------------------- Props ---------------------------------- */
  const { register, control, setValue } = props.form;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("profile");
  const tr = useTranslations("resumeBuilder");

  /* ----------------------------- React Hook Form ---------------------------- */
  const descValue = useWatch({
    control,
    name: `experiences.${props.index}.description`,
  });

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* --------------------------------- Methods -------------------------------- */
  // ── AI Refine ──────────────────────────────────────────────
  const handleRefine = async () => {
    const result = await refineContent(descValue ?? "", "experience");
    if (result && typeof result === "string") {
      setValue(`experiences.${props.index}.description`, result, {
        shouldDirty: true,
      });
      toast.success(tr("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted className="font-bold text-foreground">
          {t("experienceIndex", { index: props.index + 1 })}
        </TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            className="cursor-pointer text-red-500 hover:text-red-600"
            strokeWidth={"1.5px"}
            width={"18px"}
            onClick={props.onRemove}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md bg-card">
        {/* Title Section */}
        <LabelInput
          label={t("expTitle")}
          input={
            <Input
              placeholder={t("expTitle")}
              id="title"
              {...register(`experiences.${props.index}.title`)}
              prefix={<LucideBriefcaseBusiness strokeWidth={"1.3px"} />}
              disabled={!props.isEdit}
            />
          }
        />
        <LabelInput
          label={t("expCompany")}
          input={
            <Input
              placeholder={t("expCompanyPlaceholder")}
              {...register(`experiences.${props.index}.company`)}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Description Section */}
        <div className="w-full flex flex-col items-start gap-1">
          <div className="w-full flex items-center justify-between">
            <TypographyMuted className="text-xs font-bold text-foreground">
              {t("expDescription")}
            </TypographyMuted>
            {props.isEdit && descValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefine}
                disabled={isRefining}
                className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
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
            placeholder={t("expDescription")}
            id="description"
            {...register(`experiences.${props.index}.description`)}
            disabled={!props.isEdit}
            validationMessage={
              props.form.formState.errors?.experiences?.[props.index]
                ?.description?.message
            }
          />
        </div>
        {/* StartDate and EndDate Section */}
        <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
          {/* StartDate Section */}
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">
              {t("expStartDate")}
            </TypographyMuted>
            <Controller
              control={control}
              name={`experiences.${props.index}.startDate`}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    placeholder={t("expStartDate")}
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={!props.isEdit}
                  />
                  {fieldState.error && (
                    <TypographyP className="[&:not(:first-child)]:mt-0 text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </TypographyP>
                  )}
                </>
              )}
            />
          </div>

          {/* EndDate Section */}
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">
              {t("expEndDate")}
            </TypographyMuted>
            <Controller
              control={control}
              name={`experiences.${props.index}.endDate`}
              render={({ field }) => (
                <DatePicker
                  placeholder={t("expEndDate")}
                  date={field.value}
                  onDateChange={field.onChange}
                  disabled={!props.isEdit}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
