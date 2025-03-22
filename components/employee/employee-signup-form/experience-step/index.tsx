import LabelInput from "@/components/utils/label-input";
import { IStepFormProps } from "../props";
import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideBriefcaseBusiness, LucidePlus, LucideUser } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";

export default function ExperienceStepForm({ register }: IStepFormProps<TEmployeeSignUp>) {
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
            {...register(`experience.${0}.title`)}
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
            {...register(`experience.${0}.description`)}
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
            {...register(`experience.${0}.startDate`)}
            onDateChange={setSelectedDate}
          />
        </div>
        <div className="w-1/2 flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">End Date</TypographyMuted>
          <DatePicker
            placeholder="End Date"
            date={selectedDate}
            {...register(`experience.${0}.endDate`)}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <Button variant='secondary' className="text-xs" onClick={() => { alert('Add More') }}>
          Add More
          <LucidePlus/>
        </Button>
      </div>
    </div>
  );
}
