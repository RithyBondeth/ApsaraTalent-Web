import LabelInput from "@/components/utils/label-input";
import { Input } from "@/components/ui/input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucidePlus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Tag from "@/components/utils/tag";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";

export default function OpenPositionStepForm({
  register,
}: IStepFormProps<TCompanySignup>) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col items-start gap-5">
      <div className="w-full flex justify-between items-center">
        <TypographyH4>Add your open position information</TypographyH4>
      </div>
      <div className="w-full flex justify-between items-center gap-3 [&>div]:w-1/3 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
        <LabelInput
          label="Title"
          input={
            <Input
              placeholder="Title"
              id="title"
              {...register(`openPositions.${0}.title`)}
            />
          }
        />
        <LabelInput
          label="Experience Required"
          input={
            <Input
              placeholder="Experience"
              id="experience-required"
              {...register(`openPositions.${0}.experienceRequirement`)}
            />
          }
        />
        <LabelInput
          label="Education Required"
          input={<Input placeholder="Education" id="education-required" {...register(`openPositions.${0}.educationRequirement`)}/>}
        />
      </div>
      <div className="w-full flex justify-between gap-3 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        <div className="w-2/3 flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            placeholder="Description"
            className="placeholder:text-sm h-full"
            {...register(`openPositions.${0}.description`)}
          />
        </div>
        <div className="w-1/3 flex flex-col items-start gap-3 [&>div]:w-full">
          <LabelInput
            label="Type"
            input={<Input placeholder="Type" id="type" />}
          />
          <div className="flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Deadline Date</TypographyMuted>
            <DatePicker
              placeholder="Deadline Date"
              date={selectedDate}
              onDateChange={setSelectedDate}
              {...register(`openPositions.${0}.deadlineDate`)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        <TypographyMuted className="text-xs">Skill Required</TypographyMuted>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((skill) => (
            <Tag key={skill} label="Typescript" />
          ))}
        </div>
        <Popover open={openBenefitPopOver} onOpenChange={setOpenBenefitPopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              Add skill
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"  {...register(`openPositions.${0}.skill`)}/>
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button
                variant="outline"
                onClick={() => setOpenBenefitPopOver(false)}
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
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
