"use client";
import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { LucideAlarmClock, LucideBriefcaseBusiness, LucideUser } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { TypographySmall } from "@/components/utils/typography/typography-small";

export default function ProfessionStepForm({ register, errors }: IStepFormProps<TEmployeeSignUp>) {
  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add profession information</TypographyH4>
      <LabelInput
        label="Profession"
        input={
          <Input
            placeholder="Profession"
            id="profession"
            {...register('profession.job')}
            prefix={<LucideUser />}
            validationMessage={errors!.profession?.job?.message}
          />
        }
      />
      <div className="w-full flex justify-between items-center gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <LabelInput
          label="Year of Experience"
          input={
            <Input
              placeholder="Year of Experience"
              id="yearOfExperience"
              {...register('profession.yearOfExperience')}
              prefix={<LucideBriefcaseBusiness />}
              validationMessage={errors!.profession?.yearOfExperience?.message}
            />
          }
        />
        <LabelInput
          label="Availability"
          input={
            <Input
              placeholder="Availability"
              id="availability"
              {...register('profession.availability')}
              prefix={<LucideAlarmClock />}
              validationMessage={errors!.profession?.availability?.message}
            />
          }
        />
      </div>
      <div className="w-full flex flex-col items-start gap-1">
        <TypographyMuted className="text-xs">Description</TypographyMuted>
        <div className="w-full flex flex-col items-start gap-2">
          <Textarea placeholder="Description"  {...register('profession.description')} className="placeholder:text-sm"/>
          <TypographySmall className="text-xs text-red-500">{errors!.profession?.description?.message}</TypographySmall>
        </div>
      </div>
    </div>
  );
}
