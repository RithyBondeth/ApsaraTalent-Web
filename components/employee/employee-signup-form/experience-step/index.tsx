"use client";

import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucidePlus, LucideTrash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { IStepFormProps } from "../props";

export default function ExperienceStepForm({
  register,
  control,
  errors,
}: IStepFormProps<TEmployeeSignUp>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  // Ensure at least one empty row is shown when the step mounts.
  // The ref guard prevents React StrictMode from appending twice.
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && fields.length === 0) {
      initializedRef.current = true;
      append({
        title: "",
        description: "",
        startDate: "" as unknown as Date,
        endDate: "" as unknown as Date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addExperience = () => {
    append({
      title: "",
      description: "",
      startDate: "" as unknown as Date,
      endDate: "" as unknown as Date,
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      <TypographyH4>Add your experiences information</TypographyH4>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="relative flex flex-col items-start gap-3 w-full border border-muted-foreground/10 rounded-xl bg-muted p-5"
        >
          {/* Header Without Remove Button */}
          {fields.length === 1 && (
            <div className="w-full mb-3">
              <TypographyMuted className="text-md">
                Experience {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button */}
          {fields.length > 1 && (
            <div className="w-full flex items-center justify-between mb-3">
              <TypographyMuted className="text-md">
                Experience {index + 1}
              </TypographyMuted>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => remove(index)}
              >
                <LucideTrash2 size={16} />
              </Button>
            </div>
          )}

          {/* Title */}
          <LabelInput
            label="Title"
            input={
              <Input
                placeholder="Title"
                {...register(`experience.${index}.title`)}
                validationMessage={errors?.experience?.[index]?.title?.message}
              />
            }
          />

          {/* Description */}
          <div className="w-full flex flex-col gap-1">
            <TypographyMuted className="text-xs">Description</TypographyMuted>
            <Textarea
              autoResize
              placeholder="Description"
              className="placeholder:text-sm"
              {...register(`experience.${index}.description`)}
              validationMessage={
                errors?.experience?.[index]?.description?.message
              }
            />
          </div>

          {/* Dates */}
          <div className="w-full flex items-center gap-4">
            {/* Start Date */}
            <div className="w-full flex flex-col gap-1">
              <TypographyMuted className="text-xs">Start Date</TypographyMuted>
              <Controller
                control={control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                  <DatePicker
                    placeholder="Start Date"
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date ? new Date(date) : "")
                    }
                  />
                )}
              />
              <ErrorMessage>
                {errors?.experience?.[index]?.startDate?.message}
              </ErrorMessage>
            </div>

            {/* End Date */}
            <div className="w-full flex flex-col gap-1">
              <TypographyMuted className="text-xs">End Date</TypographyMuted>
              <Controller
                control={control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <DatePicker
                    placeholder="End Date"
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date ? new Date(date) : "")
                    }
                  />
                )}
              />
              <ErrorMessage>
                {errors?.experience?.[index]?.endDate?.message}
              </ErrorMessage>
            </div>
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          className="text-xs"
          type="button"
          onClick={addExperience}
        >
          Add More
          <LucidePlus className="ml-1" size={16} />
        </Button>
      </div>
    </div>
  );
}
