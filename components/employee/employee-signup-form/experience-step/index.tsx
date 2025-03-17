import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TExperienceStepInfo } from "../validation";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideBriefcaseBusiness, LucideUser } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";

export default function ExperienceStepForm({ register }: IStepFormProps<TExperienceStepInfo>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-full flex flex-col items-start gap-5">
      <TypographyH4>Add your experiences information</TypographyH4>
      <LabelInput
        label="Title"
        input={
          <Input
            placeholder="Title"
            id="title"
            name="title"
            prefix={<LucideBriefcaseBusiness />}
          />
        }
      />
      <LabelInput
        label="Description"
        input={
          <Input
            placeholder="Description"
            id="description"
            name="description"
            prefix={<LucideUser/>}
          />
        }
      />
      <div className="w-full flex items-center justify-between gap-5">
        <div className="w-1/2 flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">Start Date</TypographyMuted>
          <DatePicker
            placeholder="Start Date"
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        <div className="w-1/2 flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">End Date</TypographyMuted>
          <DatePicker
            placeholder="End Date"
            date={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
