import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import { IStepFormProps } from "../props";

export default function ProfessionStepForm({
  register,
  control,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");

  const availabilityOptions = [
    { id: 1, label: t("availabilityFullTime"), value: "full_time" },
    { id: 2, label: t("availabilityPartTime"), value: "part_time" },
    { id: 3, label: t("availabilityInternship"), value: "internship" },
    { id: 4, label: t("availabilityContract"), value: "contract" },
    { id: 5, label: t("availabilityFreelance"), value: "freelance" },
    { id: 6, label: t("availabilityRemote"), value: "remote" },
  ];

  const yearOfExperienceOptions = [
    { id: 1, label: t("yearOfExpNoExperience"), value: "No Experience" },
    { id: 2, label: t("yearOfExpLessThan1Year"), value: "Less than 1 year" },
    { id: 3, label: t("yearOfExp1To2Years"), value: "1 - 2 years" },
    { id: 4, label: t("yearOfExp3To5Years"), value: "3 - 5 years" },
    { id: 5, label: t("yearOfExp6To10Years"), value: "6 - 10 years" },
    { id: 6, label: t("yearOfExp10Plus"), value: "10+ years" },
  ];

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-start gap-5">
      {/* Title Section */}
      <TypographyH4>{t("empProfessionTitle")}</TypographyH4>

      {/* Looking For Position Section */}
      <LabelInput
        label={t("empProfessionLookingForPosition")}
        input={
          <Input
            placeholder={t("empProfessionLookingForPositionPlaceholder")}
            id="profession"
            {...register("profession.job")}
            validationMessage={errors!.profession?.job?.message}
          />
        }
      />

      {/* Year of Experience and Availability Section */}
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        {/* Year of Experience Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">
              {t("empProfessionYearOfExperience")}
            </TypographyMuted>
            <Controller
              name="profession.yearOfExperience"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={yearOfExperienceOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={t("empProfessionYearOfExperiencePlaceholder")}
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.yearOfExperience?.message}
          </ErrorMessage>
        </div>

        {/* Availability Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">
              {t("empProfessionAvailability")}
            </TypographyMuted>
            <Controller
              name="profession.availability"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={t("empProfessionAvailabilityPlaceholder")}
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.availability?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full flex flex-col items-start gap-1">
        <TypographyMuted className="text-xs">
          {t("empProfessionDescription")}
        </TypographyMuted>
        <div className="w-full flex flex-col items-start gap-2">
          <Textarea
            autoResize
            placeholder={t("empProfessionDescriptionPlaceholder")}
            {...register("profession.description")}
            className="placeholder:text-sm"
            validationMessage={errors!.profession?.description?.message}
          />
        </div>
      </div>
    </div>
  );
}
