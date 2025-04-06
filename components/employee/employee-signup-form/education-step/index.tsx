import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Input } from "@/components/ui/input";
import {
  LucideGraduationCap,
  LucidePlus,
  LucideSchool,
} from "lucide-react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function EducationStepForm({
  register,
  errors,
  control,
}: IStepFormProps<TEmployeeSignUp>) {
  return (
    <div className="w-full flex flex-col items-start gap-5">
      <TypographyH4>Add your educations information</TypographyH4>
      <LabelInput
        label="School"
        input={
          <Input
            placeholder="School"
            id="school"
            {...register(`educations.${0}.school`)}
            prefix={<LucideSchool />}
            validationMessage={errors!.educations?.[0]?.school?.message}
          />
        }
      />
      <LabelInput
        label="Degree"
        input={
          <Input
            placeholder="Degree"
            id="degree"
            {...register(`educations.${0}.degree`)}
            prefix={<LucideGraduationCap />}
            validationMessage={errors!.educations?.[0]?.degree?.message}
          />
        }
      />
      <div className="w-full flex flex-col items-start gap-2">
        <Controller
          name={`educations.${0}.year`}
          control={control}
          render={({ field }) => (
            <DatePicker
              placeholder="Graduation Year"
              date={field.value ? new Date(field.value) : undefined}
              onDateChange={(date) => field.onChange(date?.toISOString() || "")}
            />
          )}
        />
        <TypographySmall className="text-xs text-red-500">
          {errors!.educations?.[0]?.year?.message}
        </TypographySmall>
      </div>
      <div className="w-full flex justify-end">
        <Button
          variant="secondary"
          className="text-xs"
          onClick={() => {
            alert("Add More");
          }}
        >
          Add More
          <LucidePlus />
        </Button>
      </div>
    </div>
  );
}
