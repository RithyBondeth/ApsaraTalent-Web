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
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>
          {t("educationIndex", { index: props.index + 1 })}
        </TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            className="cursor-pointer text-red-500"
            strokeWidth={"1.5px"}
            width={"18px"}
            onClick={props.onRemove}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        {/* School Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <LabelInput
            label={t("school")}
            input={
              <Input
                placeholder={t("school")}
                id="school"
                {...register(`educations.${props.index}.school`)}
                prefix={<LucideSchool strokeWidth={"1.3px"} />}
                disabled={!props.isEdit}
              />
            }
          />
          {/* isStudying Checkbox Section */}
          <div className="flex items-center space-x-2 mt-1">
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
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
            >
              {t("currentlyStudying")}
            </label>
          </div>
        </div>
        {/* Degree Section */}
        <LabelInput
          label={t("degree")}
          input={
            <Input
              placeholder={isStudying ? t("pursuingDegree") : t("degree")}
              id="degree"
              {...register(`educations.${props.index}.degree`)}
              prefix={<LucideGraduationCap strokeWidth={"1.3px"} />}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Graduation Section */}
        <LabelInput
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
                />
              )}
            />
          }
        />
      </div>
    </div>
  );
}
