import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import LabelInput from "@/components/utils/label-input";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideGraduationCap, LucideSchool, LucideTrash2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { IEmployeeEducationFormProps } from "./props";

export default function EmployeeEducationForm(
  props: IEmployeeEducationFormProps,
) {
  const { register, control } = props.form;

  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>Education {props.index + 1}</TypographyMuted>
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
        {/* School Section */}
        <LabelInput
          label="School"
          input={
            <Input
              placeholder="School"
              id="school"
              {...register(`educations.${props.index}.school`)}
              prefix={<LucideSchool strokeWidth={"1.3px"} />}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Degree Section */}
        <LabelInput
          label="Degree"
          input={
            <Input
              placeholder="Degree"
              id="degree"
              {...register(`educations.${props.index}.degree`)}
              prefix={<LucideGraduationCap strokeWidth={"1.3px"} />}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Graduation Section */}
        <LabelInput
          label="Graduation Year"
          input={
            <Controller
              control={control}
              name={`educations.${props.index}.year`}
              render={({ field }) => (
                <DatePicker
                  placeholder="Graduation Year"
                  date={field.value ? new Date(field.value) : undefined}
                  onDateChange={field.onChange}
                  disabled={!props.isEdit}
                />
              )}
            />
          }
        />
      </div>
    </div>
  );
}
