"use client";
import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { Input } from "@/components/ui/input";
import { LucideAlarmClock, LucideBriefcaseBusiness, LucideUser } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { TProfessionStepInfo } from "../validation";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";

export default function ProfessionStepForm({ register }: IStepFormProps<TProfessionStepInfo>) {
  return (
    <div className="flex flex-col items-start gap-5">
      <TypographyH4>Add profession information</TypographyH4>
      <LabelInput
        label="Profession"
        input={
          <Input
            placeholder="Profession"
            id="profession"
            name="profession"
            prefix={<LucideUser />}
          />
        }
      />
      <div className="w-full flex justify-between items-center gap-5">
        <LabelInput
          label="Year of Experience"
          input={
            <Input
              placeholder="Year of Experience"
              id="yearOfExperience"
              name="yearOfExperience"
              prefix={<LucideBriefcaseBusiness />}
            />
          }
        />
        <LabelInput
          label="Availability"
          input={
            <Input
              placeholder="Availability"
              id="availability"
              name="availability"
              prefix={<LucideAlarmClock />}
            />
          }
        />
      </div>
      <div className="w-full flex flex-col items-start gap-1">
        <TypographyMuted className="text-xs">Description</TypographyMuted>
        <Textarea placeholder="Description" />
      </div>
    </div>
  );
}
