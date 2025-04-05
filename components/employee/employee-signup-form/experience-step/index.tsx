import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideBriefcaseBusiness, LucidePlus, LucideUser } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { Controller } from "react-hook-form";

export default function ExperienceStepForm({
  register,
  errors,
  control,
}: IStepFormProps<TEmployeeSignUp>) {

  return (
    <div className="w-full flex flex-col items-start gap-5">
      <TypographyH4>Add your experiences information</TypographyH4>
      <LabelInput
        label="Title"
        input={
          <Input
            placeholder="Title"
            id="title"
            {...register(`experience.${0}.title`)}
            prefix={<LucideBriefcaseBusiness />}
            validationMessage={errors!.experience?.[0]?.title?.message}
          />
        }
      />
      <LabelInput
        label="Description"
        input={
          <Input
            placeholder="Description"
            id="description"
            {...register(`experience.${0}.description`)}
            prefix={<LucideUser />}
            validationMessage={errors!.experience?.[0]?.description?.message}
          />
        }
      />
      <div className="w-full flex items-center justify-between gap-5">
        <div className="w-1/2 flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">Start Date</TypographyMuted>
          <div className="flex flex-col items-start gap-2 w-full">
            <Controller
              name={`experience.${0}.startDate`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  placeholder="Start Date"
                  date={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) =>
                    field.onChange(date?.toISOString() || "")
                  }
                />
              )}
            />
            <TypographySmall className="text-xs text-red-500">
              {errors!.experience?.[0]?.startDate?.message}
            </TypographySmall>
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">End Date</TypographyMuted>
          <div className="flex flex-col items-start gap-2 w-full">
            <Controller
              name={`experience.${0}.endDate`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  placeholder="End Date"
                  date={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) =>
                    field.onChange(date?.toISOString() || "")
                  }
                />
              )}
            />
            <TypographySmall className="text-xs text-red-500">
              {errors!.experience?.[0]?.endDate?.message}
            </TypographySmall>
          </div>
        </div>
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
