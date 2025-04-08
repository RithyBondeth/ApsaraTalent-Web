"use client";

import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { TCompanySignup } from "@/app/(auth)/signup/company/validation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import LabelInput from "@/components/utils/label-input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LucidePlus, LucideTrash2, LucideXCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import ErrorMessage from "@/components/utils/error-message";

export default function OpenPositionStepForm({
  register,
  control,
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TCompanySignup>) {
  const [openPopOver, setOpenPopOver] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>("");
  const { toast } = useToast();

  const initialSkills = getValues?.(`openPositions.${0}.skills`) || [];
  const [skills, setSkills] = useState<string[]>(initialSkills);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "openPositions",
  });

  const addSkill = async (index: number) => {
    const trimmed = skillInput.trim();
    if (!trimmed) return
  
    // Prevent duplicates (case-insensitive)
    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) {
      toast({
        variant: "destructive",
        title: "Duplicated Skill",
        description: "Please input another skill.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
  
    // Update the skills array for the specific open position
    const updated = [...skills, trimmed];
    setSkills(updated);
    setValue?.(`openPositions.${index}.skills`, updated);
  
    // Trigger validation for the skills field after updating
    await trigger?.(`openPositions.${index}.skills`);
  
    setSkillInput("");
    setOpenPopOver(false);
  };

  const removeSkill = async (skillToRemove: string, index: number) => {
    const updated = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updated);
    setValue?.(`openPositions.${index}.skills`, updated);
  
    // Trigger validation for the skills field after updating
    await trigger?.(`openPositions.${index}.skills`);
  };

  // Add more open positions
  const addOpenPosition = () => {
    append({
      title: "",
      description: "",
      experienceRequirement: "",
      educationRequirement: "",
      skills: [],
      salary: "",
      deadlineDate: "" as unknown as Date,
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      <TypographyH4>Add Open Position Information</TypographyH4>

      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="relative flex flex-col items-start gap-3 w-full p-5"
        >
          {/* Header Without Remove Button */}
          {fields.length === 1 && (
            <div className="w-full mb-3">
              <TypographyMuted className="text-md">
                Open Position {index + 1}
              </TypographyMuted>
            </div>
          )}

          {/* Header With Remove Button */}
          {fields.length > 1 && (
            <div className="w-full flex items-center justify-between mb-3">
              <TypographyMuted className="text-md">
                Open Position {index + 1}
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

          {/* Title, Experience, Education */}
          <LabelInput
            label="Title"
            input={
              <Input
                placeholder="Title"
                {...register(`openPositions.${index}.title`)}
                validationMessage={
                  errors?.openPositions?.[index]?.title?.message
                }
              />
            }
          />
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">Description</TypographyMuted>
            <Textarea
              placeholder="Description"
              className="placeholder:text-sm"
              {...register(`openPositions.${index}.description`)}
            />
          <ErrorMessage>{errors?.openPositions?.[index]?.description?.message}</ErrorMessage>
          </div>

          <div className="w-full flex gap-3 [&>div]:w-1/2 tablet-lg:flex-col tablet-lg:[&>div]:w-full">
            <LabelInput
              label="Experience Required"
              input={
                <Input
                  placeholder="Experience"
                  {...register(`openPositions.${index}.experienceRequirement`)}
                  validationMessage={
                    errors?.openPositions?.[index]?.experienceRequirement
                      ?.message
                  }
                />
              }
            />
            <LabelInput
              label="Education Required"
              input={
                <Input
                  placeholder="Education"
                  {...register(`openPositions.${index}.educationRequirement`)}
                  validationMessage={
                    errors?.openPositions?.[index]?.educationRequirement
                      ?.message
                  }
                />
              }
            />
          </div>

          {/* Description + Salary + Date */}
          <div className="w-full flex gap-3 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
            <LabelInput
              label="Salary"
              input={
                <Input
                  placeholder="Salary"
                  {...register(`openPositions.${index}.salary`)}
                  validationMessage={
                    errors?.openPositions?.[index]?.salary?.message
                  }
                />
              }
            />
            <div className="flex flex-col gap-2">
              <TypographyMuted className="text-xs">
                Deadline Date
              </TypographyMuted>
              <Controller
                control={control}
                name={`openPositions.${index}.deadlineDate`}
                render={({ field }) => (
                  <DatePicker
                    placeholder="Deadline"
                    date={field.value ? new Date(field.value) : undefined}
                    onDateChange={(date) =>
                      field.onChange(date ? new Date(date) : "")
                    }
                  />
                )}
              />
              <ErrorMessage>{errors?.openPositions?.[index]?.deadlineDate?.message}</ErrorMessage>
            </div>
          </div>

          {/* Skill Tags + Add Skill */}
          <div className="w-full flex flex-col gap-2">
            <TypographyMuted className="text-xs">
              Skills Required
            </TypographyMuted>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 px-3 rounded-3xl bg-muted"
                >
                  <TypographyMuted className="text-xs">{skill}</TypographyMuted>
                  <LucideXCircle
                    className="text-muted-foreground cursor-pointer"
                    width={"18px"}
                    onClick={() => removeSkill(skill, index)}
                  />
                </div>
              ))}
            </div>
            <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs w-full"
                >
                  Add skill
                  <LucidePlus size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-5 flex flex-col gap-3 w-[var(--radix-popper-anchor-width)]">
                <Input
                  placeholder="e.g. React, Tailwind"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenPopOver(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => addSkill(index)}>
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <ErrorMessage>{errors!.openPositions?.[index]?.skills?.message}</ErrorMessage>
          </div>
        </Card>
      ))}

      {/* Add More Button */}
      <div className="w-full flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={addOpenPosition}
          type="button"
        >
          Add More
          <LucidePlus size={14} />
        </Button>
      </div>
    </div>
  );
}
