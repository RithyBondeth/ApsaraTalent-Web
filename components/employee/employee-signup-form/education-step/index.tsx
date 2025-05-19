import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Input } from "@/components/ui/input";
import {
  LucideGraduationCap,
  LucidePlus,
  LucideSchool,
  LucideTrash2,
} from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import ErrorMessage from "@/components/utils/error-message";

export default function EducationStepForm({
  register,
  errors,
  control,
}: IStepFormProps<TEmployeeSignUp>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations",
  });

  const addEducation = () => {
    append({
      school: "",
      degree: "",
      year: "" as unknown as Date,
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      <TypographyH4>Add your education information</TypographyH4>
      {fields.map((field, index) => (
        <div
          className="relative flex flex-col items-start gap-3 w-full border border-muted-foreground/10 rounded-xl bg-muted p-5"
          key={field.id}
        >
          {/* Header Without Remove Button */}
          {fields.length === 1 && (
            <div className="w-full mb-3">
              <TypographyMuted className="text-md">
                Education {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button */}
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

          {/* School */}
          <LabelInput
            label="School"
            input={
              <Input
                placeholder="School"
                id="school"
                {...register(`educations.${index}.school`)}
                prefix={<LucideSchool />}
                validationMessage={errors!.educations?.[index]?.school?.message}
              />
            }
          />

          {/* Degree */}
          <LabelInput
            label="Degree"
            input={
              <Input
                placeholder="Degree"
                id="degree"
                {...register(`educations.${index}.degree`)}
                prefix={<LucideGraduationCap />}
                validationMessage={errors!.educations?.[index]?.degree?.message}
              />
            }
          />

          {/* Graduation Year */}
          <div className="w-full flex flex-col items-start gap-2">
            <div className="w-full flex flex-col items-start gap-2">
              <TypographyMuted className="text-xs">
                Graduation Year
              </TypographyMuted>
              <Controller
                name={`educations.${index}.year`}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    placeholder="Graduation Year"
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date?.toISOString() || "")
                    }
                  />
                )}
              />
            </div>
           <ErrorMessage>{errors!.educations?.[index]?.year?.message}</ErrorMessage>
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <div className="w-full flex justify-end">
        <Button variant="secondary" className="text-xs" onClick={addEducation}>
          Add More
          <LucidePlus />
        </Button>
      </div>
    </div>
  );
}
