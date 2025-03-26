import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LabelInput from "@/components/utils/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useState } from "react";
import { IOpenPositionFormProps } from "./props";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-full flex flex-col items-start gap-3">
      <TypographyMuted>{props.positionLabel}</TypographyMuted>
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        <LabelInput
          label="Title"
          input={<Input placeholder={props.titlePlaceholder ?? 'Title' } id="title" name="title" />}
        />
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            placeholder={props.descriptionPlaceholder ?? 'Description' }
            id="description"
            name="description"
            className="placeholder:text-sm"
          />
        </div>
        <LabelInput
          label="Experience Requirement"
          input={
            <Input
            placeholder={props.experienceRequirementPlaceholder ?? 'Experience Requirement' }
              id="experience-requirement"
              name="experience-requirement"
            />
          }
        />
        <LabelInput
          label="Education Requirement"
          input={
            <Input
            placeholder={props.educationRequirementPlaceholder ?? 'Education Requirement' }
              id="education-requirement"
              name="education-requirement"
            />
          }
        />
        <LabelInput
          label="Skill Requirement"
          input={
            <Input
              placeholder={props.skillRequirementPlaceholder ?? 'Skill Requirement' }
              id="skill-requirement"
              name="skill-requirement"
            />
          }
        />
        <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Announce Date</TypographyMuted>
            <DatePicker
              placeholder={props.postedDatePlaceholder ?? "Posted Date"}
              date={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Deadline Date</TypographyMuted>
            <DatePicker
              placeholder={props.deadlineDatePlaceholder ?? "Deadline Date"}
              date={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
