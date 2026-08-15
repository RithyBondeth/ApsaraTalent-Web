"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideBriefcaseBusiness,
  LucideBuilding2,
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
    <div className="flex w-full flex-col items-start gap-3">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <TypographyMuted className="font-bold text-foreground">
          {t("experienceIndex", { index: props.index + 1 })}
        </TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            className="cursor-pointer text-destructive hover:text-destructive-accent"
            strokeWidth={"1.5px"}
            width={"18px"}
            onClick={props.onRemove}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="grid w-full grid-cols-12 gap-4 border border-border bg-card p-5 tablet-md:grid-cols-1">
        {/* Title Section */}
        <LabelInput
          className="col-span-7 tablet-md:col-span-1"
          label={t("expTitle")}
          input={
            <Input
              placeholder={t("expTitle")}
              id="title"
              {...register(`experiences.${props.index}.title`)}
              prefix={<LucideBriefcaseBusiness />}
              disabled={!props.isEdit}
            />
          }
        />
        <LabelInput
          className="col-span-5 tablet-md:col-span-1"
          label={t("expCompany")}
          input={
            <Input
              placeholder={t("expCompanyPlaceholder")}
              {...register(`experiences.${props.index}.company`)}
              prefix={<LucideBuilding2 />}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Description Section */}
        <div className="col-span-12 flex w-full flex-col items-start gap-1 tablet-md:col-span-1">
          <div className="flex w-full items-center justify-between">
            <TypographyMuted className="text-xs">
              {t("expDescription")}
            </TypographyMuted>
            {props.isEdit && descValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefine}
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
        <div className="col-span-12 flex w-full items-center justify-between gap-4 tablet-md:col-span-1 tablet-md:flex-col tablet-md:[&>div]:!w-full">
          {/* StartDate Section */}
          <div className="flex w-1/2 flex-col items-start gap-1">
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
                    popoverClassName="profile-overlay profile-calendar-popover"
                    calendarClassName="profile-calendar"
                  />
                  {fieldState.error && (
                    <TypographyP className="mt-1 text-xs text-destructive [&:not(:first-child)]:mt-0">
                      {fieldState.error.message}
                    </TypographyP>
                  )}
                </>
              )}
            />
          </div>

          {/* EndDate Section */}
          <div className="flex w-1/2 flex-col items-start gap-1">
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
                  popoverClassName="profile-overlay profile-calendar-popover"
                  calendarClassName="profile-calendar"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
