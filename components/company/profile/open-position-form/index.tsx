"use client"

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LabelInput from "@/components/utils/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { IOpenPositionFormProps } from "./props";
import Tag from "@/components/utils/tag";
import { Controller } from "react-hook-form";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LucidePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  const { register, control } = props.form;

  return (
    <div className="w-full flex flex-col items-start gap-3">
      <TypographyMuted>{props.positionLabel}</TypographyMuted>
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        <LabelInput
          label="Title"
          input={
            <Input
              placeholder={props.isEdit ? "Title" : props.title}
              id="title"
              {...register(`openPositions.${props.index}.title`)}
              disabled={!props.isEdit}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            placeholder={props.isEdit ? "Description" : props.description}
            id="description"
            {...register(`openPositions.${props.index}.description`)}
            className="placeholder:text-sm"
            disabled={!props.isEdit}
          />
        </div>
        <LabelInput
          label="Experience Requirement"
          input={
            <Input
              placeholder={props.isEdit ? "Experience" : props.experience}
              id="experience-requirement"
              {...register(`openPositions.${props.index}.experienceRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />
        <LabelInput
          label="Education Requirement"
          input={
            <Input
              placeholder={props.isEdit ? "Education" : props.education}
              id="education-requirement"
              {...register(`openPositions.${props.index}.educationRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />
        <div className="w-full flex flex-col items-start gap-3">
          <TypographyMuted className="text-xs">
            Skill Requirements
          </TypographyMuted>
          <div className="flex flex-wrap gap-2">
            {props.skill?.map((item) => (
              <Tag key={item} label={item} />
            ))}
          </div>
          {props.isEdit && <Popover open={openValuePopOver} onOpenChange={setOpenValuePopOver}>
          <PopoverTrigger asChild>
            <Button className="w-full text-xs" variant="secondary">
              Add skill
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input placeholder="Enter your skill (e.g. Figma, Photo shop etc.)" />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button variant="outline" onClick={() => setOpenValuePopOver(false)}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </PopoverContent>
        </Popover>}
        </div> 
        <LabelInput
          label="Salary Range"
          input={
            <Input
              placeholder={props.isEdit ? "Salary Range" : props.salary}
              id="salary-range"
              {...register(`openPositions.${props.index}.salary`)}
              disabled={!props.isEdit}
            />
          }
        />
        <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Announce Date</TypographyMuted>
            <Controller
              control={control}
              name={`openPositions.${props.index}.postedDate`}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={!props.isEdit}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Deadline Date</TypographyMuted>
            <Controller
              control={control}
              name={`openPositions.${props.index}.deadlineDate`}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={!props.isEdit}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
