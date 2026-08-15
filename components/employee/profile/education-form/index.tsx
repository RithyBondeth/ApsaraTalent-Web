"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { YearPicker } from "@/components/ui/year-picker";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideGraduationCap, LucideSchool, LucideTrash2 } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { IEmployeeEducationFormProps } from "./props";
import { useTranslations } from "next-intl";

export default function EmployeeEducationForm(
  props: IEmployeeEducationFormProps,
) {
  /* --------------------------------- Props --------------------------------- */
  const { register, control } = props.form;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("profile");

  /* ---------------------------------- Form --------------------------------- */
  const isStudying = useWatch({
    control,
    name: `educations.${props.index}.isStudying`,
  });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between">
        <TypographyMuted className="font-medium text-foreground">
          {t("educationIndex", { index: props.index + 1 })}
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
      <div className="grid w-full grid-cols-12 items-end gap-4 border border-border bg-card p-5 tablet-md:grid-cols-1">
        {/* School Section */}
        <LabelInput
          className="col-span-7 tablet-md:col-span-1"
          label={t("school")}
          input={
            <Input
              placeholder={t("school")}
              id="school"
              {...register(`educations.${props.index}.school`)}
              prefix={<LucideSchool />}
              disabled={!props.isEdit}
            />
          }
        />

        {/* Degree Section */}
        <LabelInput
          className="col-span-5 tablet-md:col-span-1"
          label={t("degree")}
          input={
            <Input
              placeholder={isStudying ? t("pursuingDegree") : t("degree")}
              id="degree"
              {...register(`educations.${props.index}.degree`)}
              prefix={<LucideGraduationCap />}
              disabled={!props.isEdit}
            />
          }
        />

        {/* isStudying Checkbox Section */}
        <div className="col-span-7 flex h-12 w-full items-center gap-2 border border-input bg-background px-3 tablet-md:col-span-1">
          <Controller
            control={control}
            name={`educations.${props.index}.isStudying`}
            render={({ field }) => (
              <Checkbox
                id={`isStudying-profile-${props.index}`}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={!props.isEdit}
              />
            )}
          />
          <label
            htmlFor={`isStudying-profile-${props.index}`}
            className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("currentlyStudying")}
          </label>
        </div>
        {/* Graduation Section */}
        <LabelInput
          className="col-span-5 tablet-md:col-span-1"
          label={isStudying ? t("expectedGraduationYear") : t("graduationYear")}
          input={
            <Controller
              control={control}
              name={`educations.${props.index}.year`}
              render={({ field }) => (
                <YearPicker
                  placeholder={
                    isStudying
                      ? t("expectedGraduationYear")
                      : t("graduationYear")
                  }
                  year={field.value ? Number(field.value) : undefined}
                  onYearChange={(yr) => field.onChange(yr)}
                  disabled={!props.isEdit}
                  popoverClassName="profile-overlay profile-year-popover"
                />
              )}
            />
          }
        />
      </div>
    </div>
  );
}
