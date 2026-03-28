import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getRandomBadgeColor } from "@/utils/functions/get-random-badge-color";
import { LucidePlus, LucideTrash2, LucideXCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

export default function OpenPositionStepForm({
  register,
  control,
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TCompanySignup>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");

  /* -------------------------------- All States ------------------------------ */
  const [skillInput, setSkillInput] = useState<string>("");
  const [openPopOvers, setOpenPopOvers] = useState<boolean[]>([]);

  /* ---------------------------------- Form ---------------------------------- */
  const { fields, append, remove } = useFieldArray({
    control: control!,
    name: "openPositions",
  });

  /* --------------------------------- Methods -------------------------------- */
  // ── Add Skill ─────────────────────────────────────────
  const addSkill = async (index: number) => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    const currentSkills = getValues?.(`openPositions.${index}.skills`) || [];

    const alreadyExists = currentSkills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      toast.error(t("duplicatedSkill"), {
        description: t("pleaseInputAnotherSkill"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      return;
    }

    const updatedSkills = [...currentSkills, trimmed];
    setValue?.(`openPositions.${index}.skills`, updatedSkills);

    await trigger?.(`openPositions.${index}.skills`);

    setSkillInput("");
    setOpenPopOvers((prevState) => {
      const updatedState = [...prevState];
      updatedState[index] = false;
      return updatedState;
    });
  };

  // ── Remove Skill ───────────────────────────────────────
  const removeSkill = async (skillToRemove: string, index: number) => {
    const currentSkills = getValues?.(`openPositions.${index}.skills`) || [];
    const updatedSkills = currentSkills.filter(
      (skill) => skill !== skillToRemove,
    );
    setValue?.(`openPositions.${index}.skills`, updatedSkills);

    await trigger?.(`openPositions.${index}.skills`);
  };

  // ── Add Open Position ───────────────────────────────────
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

    setOpenPopOvers((prevState) => [...prevState, false]);
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto">
      {/* Title Section */}
      <TypographyH4>Add Open Position Information</TypographyH4>

      {/* Open Position Form Section */}
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

          {/* Title Section */}
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

          {/* Availability Section */}
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

          {/* Description Section */}
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">Description</TypographyMuted>
            <Textarea
              autoResize
              placeholder="Description"
              className="placeholder:text-sm"
              {...register(`openPositions.${index}.description`)}
              validationMessage={
                errors?.openPositions?.[index]?.description?.message
              }
            />
          </div>

          {/* Experience and Education Section */}
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

          {/* Salary and Deadline Date Section */}
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

          {/* Skill Tags and Add Skill Section */}
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

            {/* Add New Skill PopOver Section */}
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
