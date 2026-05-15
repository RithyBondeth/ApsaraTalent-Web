import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucidePlus, LucideTrash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { IStepFormProps } from "../props";

export default function ExperienceStepForm({
  register,
  control,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");

  /* -------------------------------- Form Section ---------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  /* -------------------------------- All States ------------------------------ */
  const initializedRef = useRef<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      append({
        title: "",
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
      description: "",
      startDate: "" as unknown as Date,
      endDate: "" as unknown as Date,
    });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      {/* Title Section */}
      <TypographyH4>{t("empExperienceTitle")}</TypographyH4>

      {/* Experience Form Section */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative flex flex-col items-start gap-3 w-full border border-muted-foreground/10 rounded-xl bg-muted p-5"
        >
          {/* Header Without Remove Button Section */}
          {fields.length === 1 && (
            <div className="w-full mb-3">
              <TypographyMuted className="text-md">
                {t("empExperienceLabel")} {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button Section */}
          {fields.length > 1 && (
            <div className="w-full flex items-center justify-between mb-3">
              <TypographyMuted className="text-md">
                {t("empExperienceLabel")} {index + 1}
              </TypographyMuted>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => remove(index)}
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

          {/* Description Section */}
          <div className="w-full flex flex-col gap-1">
            <TypographyMuted className="text-xs">
              {t("empExperienceDescription")}
            </TypographyMuted>
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
          <div className="w-full flex items-center gap-4">
            {/* StartDate Section */}
            <div className="w-full flex flex-col gap-1">
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
            <div className="w-full flex flex-col gap-1">
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
