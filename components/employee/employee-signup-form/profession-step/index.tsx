"use client";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/error-message";
import LabelInput from "@/components/utils/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { availabilityConstant, yearOfExperienceConstant } from "@/utils/constants/ui.constant";
import { Controller } from "react-hook-form";
import { IStepFormProps } from "../props";

export default function ProfessionStepForm({
  register,
  control,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add profession information</TypographyH4>
      <LabelInput
        label="Looking for position"
        input={
          <Input
            placeholder="Looking for position"
            id="profession"
            {...register("profession.job")}
            validationMessage={errors!.profession?.job?.message}
          />
        }
      />
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">
              Year of Experience
            </TypographyMuted>
            <Controller
              name="profession.yearOfExperience"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={yearOfExperienceConstant}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Year of Experience"
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.yearOfExperience?.message}
          </ErrorMessage>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">Availability</TypographyMuted>
            <Controller
              name="profession.availability"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityConstant}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Availability"
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.availability?.message}
          </ErrorMessage>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-1">
        <TypographyMuted className="text-xs">Description</TypographyMuted>
        <div className="w-full flex flex-col items-start gap-2">
          <Textarea
            autoResize
            placeholder="Description"
            {...register("profession.description")}
            className="placeholder:text-sm"
            validationMessage={errors!.profession?.description?.message}
          />
        </div>
      </div>
    </div>
  );
}
