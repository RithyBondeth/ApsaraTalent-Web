import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LabelInput from "@/components/utils/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideBriefcaseBusiness, LucideTrash2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { IEmployeeExperienceFormProps } from "./props";

export default function EmployeeExperienceForm(
  props: IEmployeeExperienceFormProps,
) {
  const { register, control } = props.form;

  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>Experience {props.index + 1}</TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            className="cursor-pointer text-red-500"
            strokeWidth={"1.5px"}
            width={"18px"}
            onClick={props.onRemove}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        {/* Title Section */}
        <LabelInput
          label="Title"
          input={
            <Input
              placeholder="Title"
              id="title"
              {...register(`experiences.${props.index}.title`)}
              className="placeholder:!text-red-500"
              prefix={<LucideBriefcaseBusiness strokeWidth={"1.3px"} />}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Description Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">Description</TypographyMuted>
          <Textarea
            autoResize
            placeholder="Description"
            id="description"
            {...register(`experiences.${props.index}.description`)}
            disabled={!props.isEdit}
          />
        </div>
        {/* StartDate and EndDate Section */}
        <div className="w-full flex justify-between items-center gap-5 tablet-sm:flex-col tablet-sm:[&>div]:!w-full">
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">Start Date</TypographyMuted>
            <Controller
              control={control}
              name={`experiences.${props.index}.startDate`}
              render={({ field, fieldState }) => (
                <>
                  <DatePicker
                    placeholder="Start Date"
                    date={field.value}
                    onDateChange={field.onChange}
                    disabled={!props.isEdit}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <div className="w-1/2 flex flex-col items-start gap-1">
            <TypographyMuted className="text-xs">End Date</TypographyMuted>
            <Controller
              control={control}
              name={`experiences.${props.index}.endDate`}
              render={({ field }) => (
                <DatePicker
                  placeholder="End Date"
                  date={field.value}
                  onDateChange={field.onChange}
                  disabled={!props.isEdit}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
