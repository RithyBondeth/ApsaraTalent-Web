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
import { getRandomBadgeColor } from "@/utils/extensions/get-random-badge-color";
import Tag from "@/components/utils/tag";

export default function OpenPositionStepForm({
  register,
  control,
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TCompanySignup>) {
  // Utils
  const { toast } = useToast();

  // Open Position Helpers
  const [skillInput, setSkillInput] = useState<string>("");
  const [openPopOvers, setOpenPopOvers] = useState<boolean[]>([]);

  const { fields, append, remove } = useFieldArray({
    control: control!,
    name: "openPositions",
  });

  // Handle Add Skill
  const addSkill = async (index: number) => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    // Get the current skills for the specific open position at the given index
    const currentSkills = getValues?.(`openPositions.${index}.skills`) || [];

    // Prevent duplicates (case-insensitive)
    const alreadyExists = currentSkills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
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

    // Add the new skill to the skills list
    const updatedSkills = [...currentSkills, trimmed];
    setValue?.(`openPositions.${index}.skills`, updatedSkills);

    // Trigger validation after updating the skills
    await trigger?.(`openPositions.${index}.skills`);

    // Reset the skill input field after adding the skill
    setSkillInput("");
    setOpenPopOvers((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = false; // Close the popover after adding the skill
      return updatedState;
    });
  };

  // Handle Remove Skill
  const removeSkill = async (skillToRemove: string, index: number) => {
    const currentSkills = getValues?.(`openPositions.${index}.skills`) || [];
    const updatedSkills = currentSkills.filter(
      (skill) => skill !== skillToRemove,
    );
    setValue?.(`openPositions.${index}.skills`, updatedSkills);

    // Trigger validation after removing the skill
    await trigger?.(`openPositions.${index}.skills`);
  };

  const addOpenPosition = () => {
    append({
      title: "",
      description: "",
      experienceRequirement: "",
      educationRequirement: "",
      skills: [],
      types: "",
      salary: "",
      deadlineDate: "" as unknown as Date,
    });

    // Add a new popover state for the new form
    setOpenPopOvers((prevState) => [...prevState, false]);
  };

  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      <TypographyH4>Add Open Position Information</TypographyH4>

      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="relative flex flex-col items-start gap-3 w-full p-5"
        >
          {/* Header With Remove Button Section */}
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

          {/* Title, Experience, Education Section */}
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
          <LabelInput
            label="Type"
            input={
              <Input
                placeholder="Type"
                {...register(`openPositions.${index}.types`)}
                validationMessage={errors?.openPositions?.[
                  index
                ]?.types?.message?.toString()}
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
            <ErrorMessage>
              {errors?.openPositions?.[index]?.description?.message}
            </ErrorMessage>
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

          {/* Description + Salary + Date Section */}
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
                control={control!}
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
              <ErrorMessage>
                {errors?.openPositions?.[index]?.deadlineDate?.message}
              </ErrorMessage>
            </div>
          </div>

          {/* Skill Tags + Add Skill Section */}
          <div className="w-full flex flex-col gap-2">
            <TypographyMuted className="text-xs">
              Skills Required
            </TypographyMuted>
            <div className="flex flex-wrap gap-3">
              {(getValues?.(`openPositions.${index}.skills`) || []).map(
                (skill, index) => {
                  const { bg } = getRandomBadgeColor(skill);
                  return (
                    <div
                      key={index}
                      className={`flex items-center ${bg} pr-2 rounded-2xl`}
                    >
                      <Tag label={skill} />
                      <LucideXCircle
                        className="text-muted-foreground cursor-pointer text-red-500"
                        width={"18px"}
                        onClick={() => removeSkill(skill, index)}
                      />
                    </div>
                  );
                },
              )}
            </div>
            <Popover
              open={openPopOvers[index]}
              onOpenChange={(state) => {
                const updatedState = [...openPopOvers];
                updatedState[index] = state;
                setOpenPopOvers(updatedState);
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  type="button"
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
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setOpenPopOvers((prevState) => {
                        const updatedState = [...prevState];
                        updatedState[index] = false;
                        return updatedState;
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => addSkill(index)}
                  >
                    Save
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <ErrorMessage>
              {errors!.openPositions?.[index]?.skills?.message}
            </ErrorMessage>
          </div>
        </Card>
      ))}

      {/* Add More Button Section */}
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
