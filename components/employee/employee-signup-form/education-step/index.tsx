import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { YearPicker } from "@/components/ui/year-picker";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideGraduationCap,
  LucidePlus,
  LucideSchool,
  LucideTrash2,
} from "lucide-react";
import {
  Controller,
  useFieldArray,
  useWatch,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { IStepFormProps } from "../props";

export default function EducationStepForm({
  register,
  errors,
  control,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Form --------------------------------- */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Education ─────────────────────────────────────────
  const addEducation = () => {
    append({
      school: "",
      degree: "",
      year: undefined as unknown as number,
    });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      {/* Title Section */}
      <TypographyH4>Add your education information</TypographyH4>

      {/* Education Form Section */}
      {fields.map((field, index) => (
        <div
          className="relative flex flex-col items-start gap-3 w-full border border-muted-foreground/10 rounded-xl bg-muted p-5"
          key={field.id}
        >
          {/* Header Without Remove Button Section */}
          {fields.length === 1 && (
            <div className="w-full mb-3">
              <TypographyMuted className="text-md">
                Education {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button Section */}
          {fields.length > 1 && (
            <div className="w-full flex items-center justify-between mb-3">
              <TypographyMuted className="text-md">
                Education {index + 1}
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

          {/* School Section */}
          <div className="w-full flex flex-col items-start gap-2">
            <LabelInput
              label="School"
              input={
                <Input
                  placeholder="School"
                  id={`school-${index}`}
                  {...register(`educations.${index}.school`)}
                  prefix={<LucideSchool />}
                  validationMessage={
                    errors!.educations?.[index]?.school?.message
                  }
                />
              }
            />

            {/* isStudying Checkbox Section */}
            <div className="flex items-center space-x-2 mt-1">
              <Controller
                control={control}
                name={`educations.${index}.isStudying`}
                render={({ field }) => (
                  <Checkbox
                    id={`isStudying-${index}`}
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor={`isStudying-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
              >
                I am currently studying here
              </label>
            </div>
          </div>

          {/* Dynamic Watcher for isStudying Section */}
          <IsStudyingWatcher
            index={index}
            control={control}
            register={register}
            errors={errors}
          />
        </div>
      ))}

      {/* Add More Button Section */}
      <div className="w-full flex justify-end">
        <Button
          variant="secondary"
          type="button"
          className="text-xs"
          onClick={addEducation}
        >
          Add More
          <LucidePlus />
        </Button>
      </div>
    </div>
  );
}

function IsStudyingWatcher({
  index,
  control,
  register,
  errors,
}: {
  index: number;
  control: Control<TEmployeeSignUp> | undefined;
  register: UseFormRegister<TEmployeeSignUp>;
  errors: FieldErrors<TEmployeeSignUp> | undefined;
}) {
  /* -------------------------------- All States ------------------------------ */
  const isStudying = useWatch({
    control,
    name: `educations.${index}.isStudying`,
  });

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Degree Section */}
      <LabelInput
        label="Degree"
        input={
          <Input
            placeholder={
              isStudying ? "e.g. Pursuing Bachelor's, Undergrad" : "Degree"
            }
            id={`degree-${index}`}
            {...register(`educations.${index}.degree`)}
            prefix={<LucideGraduationCap />}
            validationMessage={errors!.educations?.[index]?.degree?.message}
          />
        }
      />

      {/* Graduation Year Section */}
      <div className="w-full flex flex-col items-start gap-2">
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {isStudying ? "Expected Graduation Year" : "Graduation Year"}
          </TypographyMuted>
          <Controller
            name={`educations.${index}.year`}
            control={control}
            render={({ field }) => (
              <YearPicker
                placeholder={
                  isStudying ? "Expected Graduation Year" : "Graduation Year"
                }
                year={field.value ? Number(field.value) : undefined}
                onYearChange={(yr) => field.onChange(yr)}
              />
            )}
          />
        </div>
        <ErrorMessage>
          {errors!.educations?.[index]?.year?.message}
        </ErrorMessage>
      </div>
    </div>
  );
}
