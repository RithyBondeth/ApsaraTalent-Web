"use client";

import { Button } from "@/components/ui/button";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { availabilityConstant } from "@/utils/constants/ui.constant";
import { getRandomBadgeColor } from "@/utils/functions/ui";
import { Popover } from "@radix-ui/react-popover";
import { LucidePlus, LucideTrash2, LucideXCircle } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { IOpenPositionFormProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  const { register, control, getValues, setValue } = props.form;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");
  const tP = useTranslations("profile");

  /* -------------------------------- All States ------------------------------ */
  const initialSkill = getValues(`openPositions.${props.index}.skills`) || "";
  const [skills, setSkills] = useState<string>(initialSkill);
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  /* --------------------------------- Methods --------------------------------- */
  // ── Add Skill ─────────────────────────────────────────
  const addSkill = () => {
    const trimmed = skillInput?.trim();
    if (!trimmed) return;

    const currentSkillsArray = skills
      ? skills.split(", ").filter((s) => s.trim() !== "")
      : [];

    const alreadyExists = currentSkillsArray.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedSkill"), {
        description: t("thisSkillAlreadyExists"),
        action: { label: t("tryAgain"), onClick: () => {} },
      });
      setSkillInput(null);
      setOpenSkillPopOver(false);
      return;
    }

    const updatedSkills = [...currentSkillsArray, trimmed].join(", ");
    setSkills(updatedSkills);

    setValue(`openPositions.${props.index}.skills`, updatedSkills, {
      shouldDirty: true,
    });

    setSkillInput(null);
    setOpenSkillPopOver(false);
  };

  // ── Remove Skill ───────────────────────────────────────
  const removeSkill = (skillToRemove: string) => {
    const updatedSkillsArray = skills
      .split(", ")
      .filter((skill) => skill !== skillToRemove);
    const updatedSkills = updatedSkillsArray.join(", ");

    setSkills(updatedSkills);

    setValue(`openPositions.${props.index}.skills`, updatedSkills, {
      shouldDirty: true,
    });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-start gap-3">
      {/* Header With Remove Button Section */}
      <div className="w-full flex items-center justify-between">
        <TypographyMuted>{tP("positionIndex", { index: Number(props.index) + 1 })}</TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            onClick={props.onRemove}
            className="cursor-pointer text-red-500"
            width={"18px"}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 p-5 border-[1px] border-muted rounded-md">
        {/* Title Section */}
        <LabelInput
          label={tP("expTitle")}
          input={
            <Input
              placeholder={props.isEdit ? tP("expTitle") : props.title}
              id="title"
              {...register(`openPositions.${props.index}.title`)}
              disabled={!props.isEdit}
            />
          }
        />

        {/* Description Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">{tP("expDescription")}</TypographyMuted>
          <Textarea
            autoResize
            placeholder={props.isEdit ? tP("expDescription") : props.description}
            id="description"
            {...register(`openPositions.${props.index}.description`)}
            className="placeholder:text-sm"
            disabled={!props.isEdit}
            validationMessage={
              props.form.formState.errors?.openPositions?.[props.index]
                ?.description?.message
            }
          />
        </div>

        {/* Availability Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">{tP("positionType")}</TypographyMuted>
          <Controller
            name={`openPositions.${props.index}.type`}
            control={control}
            render={({ field }) => (
              <CreatableCombobox
                options={availabilityConstant}
                value={field.value || ""}
                onChange={(value) => field.onChange(value)}
                placeholder={tP("selectType")}
              />
            )}
          />
        </div>

        {/* Experience Requirement Section */}
        <LabelInput
          label={tP("experienceRequirements")}
          input={
            <Input
              placeholder={
                props.isEdit ? tP("experienceRequirements") : props.experienceReqirement
              }
              id="experience-requirement"
              {...register(
                `openPositions.${props.index}.experienceRequirement`,
              )}
              disabled={!props.isEdit}
            />
          }
        />
        {/* Education Requirement Section */}
        <LabelInput
          label={tP("educationRequirements")}
          input={
            <Input
              placeholder={
                props.isEdit ? tP("educationRequirements") : props.educationRequirement
              }
              id="education-requirement"
              {...register(`openPositions.${props.index}.educationRequirement`)}
              disabled={!props.isEdit}
            />
          }
        />

        {/* Skill Section */}
        <div className="w-full flex flex-col items-start gap-3">
          <TypographyMuted className="text-xs">
            {tP("skillRequirements")}
          </TypographyMuted>
          {/* Skill List Section */}
          <div className="flex flex-wrap gap-2">
            {skills &&
              skills.length > 0 &&
              skills.split(", ").map((item, index) => {
                const { bg } = getRandomBadgeColor(item);
                return (
                  <div
                    key={index}
                    className={`flex items-center ${props.isEdit && `${bg} pr-2 rounded-2xl`}`}
                  >
                    <Tag label={item} />
                    {props.isEdit && (
                      <LucideXCircle
                        className="text-muted-foreground cursor-pointer text-red-500"
                        width={"18px"}
                        onClick={() => removeSkill(item)}
                      />
                    )}
                  </div>
                );
              })}
          </div>
          {/* Skill Poppver Section */}
          {props.isEdit && (
            <Popover open={openSkillPopOver} onOpenChange={setOpenSkillPopOver}>
              <PopoverTrigger asChild>
                <Button type="button" className="w-full text-xs" variant="secondary">
                  {tP("addSkill")}
                  <LucidePlus />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
                <Input
                  placeholder={tP("enterSkillPlaceholder")}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <div className="flex items-center gap-1 [&>button]:text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenSkillPopOver(false)}
                  >
                    {tP("cancel")}
                  </Button>
                  <Button type="button" onClick={addSkill}>{tP("save")}</Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Salary Range Section */}
        <LabelInput
          label={tP("salaryRange")}
          input={
            <Input
              placeholder={props.isEdit ? tP("salaryRange") : props.salary}
              id="salary-range"
              {...register(`openPositions.${props.index}.salary`)}
              disabled={!props.isEdit}
            />
          }
        />

        {/* Open Position ID Section: Hidden */}
        <LabelInput
          className="hidden"
          label="Open Position ID"
          input={
            <Input
              placeholder={props.isEdit ? "ID" : props.positionUUID}
              id="uuid"
              {...register(`openPositions.${props.index}.uuid`)}
              disabled={!props.isEdit}
            />
          }
        />

        {/* Deadline Date Section */}
        <div className="w-full flex flex-col items-start gap-1">
          <TypographyMuted className="text-xs">{tP("deadlineDate")}</TypographyMuted>
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
                  <TypographyP className="[&:not(:first-child)]:mt-0 text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </TypographyP>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
