"use client";

import { Button } from "@/components/ui/button";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  availabilityConstant,
  salaryCurrencyConstant,
  workModeConstant,
} from "@/utils/constants/ui.constant";
import { Popover } from "@radix-ui/react-popover";
import {
  LucidePlus,
  LucideTrash2,
  LucideXCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { IOpenPositionFormProps } from "./props";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";

export default function OpenPositionForm(props: IOpenPositionFormProps) {
  const { register, control, getValues, setValue } = props.form;

  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("toast");
  const tP = useTranslations("profile");
  const tr = useTranslations("resumeBuilder");

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* -------------------------------- All States ------------------------------ */
  const initialSkill = getValues(`openPositions.${props.index}.skills`) || "";
  const [skills, setSkills] = useState<string>(initialSkill);
  const [skillInput, setSkillInput] = useState<string | null>(null);
  const [openSkillPopOver, setOpenSkillPopOver] = useState<boolean>(false);

  /* ----------------------------- React Hook Form ---------------------------- */
  const descValue = useWatch({
    control,
    name: `openPositions.${props.index}.description`,
  });

  /* --------------------------------- Methods --------------------------------- */
  // ── AI Refine ─────────────────────────────────────────
  const handleRefine = async () => {
    const result = await refineContent(descValue ?? "", "experience");
    if (result && typeof result === "string") {
      setValue(`openPositions.${props.index}.description`, result, {
        shouldDirty: true,
      });
      toast.success(tr("refinedSuccess"));
    }
  };

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
        <TypographyMuted className="font-bold text-foreground">
          {tP("positionIndex", { index: Number(props.index) + 1 })}
        </TypographyMuted>
        {props.isEdit && (
          <LucideTrash2
            onClick={props.onRemove}
            className="cursor-pointer text-red-500 hover:text-red-600"
            width={"18px"}
          />
        )}
      </div>

      {/* Content Section */}
      <div className="w-full flex flex-col items-start gap-5 rounded-xl border border-border/60 bg-background/50 p-4 sm:p-5">
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
        <div className="w-full flex flex-col items-start gap-1">
          <div className="w-full flex items-center justify-between">
            <TypographyMuted className="text-xs font-bold text-foreground">
              {tP("expDescription")}
            </TypographyMuted>
            {props.isEdit && descValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRefine}
                disabled={isRefining}
                className="h-7 gap-1 rounded-lg px-2 text-[10px] text-brand hover:bg-brand-soft hover:text-brand"
              >
                {isRefining ? (
                  <Loader2 size={10} className="animate-spin" />
                ) : (
                  <Sparkles size={10} />
                )}
                {tr("aiRefine")}
              </Button>
            )}
          </div>
          <Textarea
            autoResize
            placeholder={
              props.isEdit ? tP("expDescription") : props.description
            }
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

        {/* Position Type and Work Mode Section */}
        <div className="w-full flex gap-3 tablet-md:flex-col">
          {/* Position Type Section */}
          <div className="flex-1 flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">
              {tP("positionType")}
            </TypographyMuted>
            <Controller
              name={`openPositions.${props.index}.type`}
              control={control}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityConstant}
                  value={field.value || ""}
                  onChange={(value) => field.onChange(value)}
                  placeholder={tP("selectType")}
                  disabled={!props.isEdit}
                />
              )}
            />
          </div>
          {/* Work Mode Section */}
          <div className="flex-1 flex flex-col gap-1">
            <TypographyMuted className="text-xs">
              {tP("workMode")}
            </TypographyMuted>
            <Controller
              control={control}
              name={`openPositions.${props.index}.workMode`}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  disabled={!props.isEdit}
                >
                  <SelectTrigger className="h-12 text-muted-foreground">
                    <SelectValue placeholder={tP("workModePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {workModeConstant.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Experience and Education Requirements Section */}
        <div className="w-full flex gap-3 tablet-md:flex-col">
          {/* Experience Requirements Section */}
          <LabelInput
            className="flex-1"
            label={tP("experienceRequirements")}
            input={
              <Input
                placeholder={
                  props.isEdit
                    ? tP("experienceRequirements")
                    : props.experienceReqirement
                }
                id="experience-requirement"
                {...register(
                  `openPositions.${props.index}.experienceRequirement`,
                )}
                disabled={!props.isEdit}
              />
            }
          />
          {/* Education Requirements Section */}
          <LabelInput
            className="flex-1"
            label={tP("educationRequirements")}
            input={
              <Input
                placeholder={
                  props.isEdit
                    ? tP("educationRequirements")
                    : props.educationRequirement
                }
                id="education-requirement"
                {...register(
                  `openPositions.${props.index}.educationRequirement`,
                )}
                disabled={!props.isEdit}
              />
            }
          />
        </div>

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
                return (
                  <div
                    key={index}
                    className={`flex items-center ${props.isEdit ? "rounded-xl border border-border/60 bg-background/60 pr-2" : ""}`}
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
                <Button
                  type="button"
                  className="w-full text-xs"
                  variant="secondary"
                >
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
                  <Button type="button" onClick={addSkill}>
                    {tP("save")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Structured Salary Section (Min / Max / Currency) */}
        <div className="w-full flex flex-col gap-2">
          <TypographyMuted className="text-xs">
            {tP("salaryRange")}
          </TypographyMuted>
          {/* Currency Section */}
          <Controller
            control={control}
            name={`openPositions.${props.index}.salaryCurrency`}
            render={({ field }) => (
              <Select
                value={field.value ?? "USD"}
                onValueChange={field.onChange}
                disabled={!props.isEdit}
              >
                <SelectTrigger className="h-12 w-36">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  {salaryCurrencyConstant.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {/* Min and Max Section */}
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Controller
                control={control}
                name={`openPositions.${props.index}.salaryMin`}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={tP("salaryMin") ?? "Min"}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    disabled={!props.isEdit}
                  />
                )}
              />
            </div>
            <span className="text-muted-foreground text-sm shrink-0">—</span>
            <div className="flex-1 min-w-0">
              <Controller
                control={control}
                name={`openPositions.${props.index}.salaryMax`}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={tP("salaryMax") ?? "Max"}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    disabled={!props.isEdit}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Job Location and Number of Openings Section */}
        <div className="w-full flex gap-3 tablet-md:flex-col">
          {/* Job Location Section */}
          <LabelInput
            className="flex-1"
            label={tP("jobLocation")}
            input={
              <Input
                placeholder={tP("jobLocationPlaceholder")}
                {...register(`openPositions.${props.index}.location`)}
                disabled={!props.isEdit}
              />
            }
          />
          {/* Number of Openings Section */}
          <LabelInput
            className="flex-1"
            label={tP("openingsCount")}
            input={
              <Controller
                control={control}
                name={`openPositions.${props.index}.openingsCount`}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={tP("openingsCountPlaceholder")}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value, 10),
                      )
                    }
                    disabled={!props.isEdit}
                  />
                )}
              />
            }
          />
        </div>

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
          <TypographyMuted className="text-xs">
            {tP("deadlineDate")}
          </TypographyMuted>
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
