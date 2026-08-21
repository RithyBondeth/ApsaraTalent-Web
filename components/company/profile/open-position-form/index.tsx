"use client";

import { cn } from "@/lib/utils";
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
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  availabilityConstant,
  languageConstant,
  salaryCurrencyConstant,
  workModeConstant,
  yearOfExperienceConstant,
} from "@/utils/constants/ui.constant";
import { Popover } from "@radix-ui/react-popover";
import {
  LucideBadgeCheck,
  LucideBriefcase,
  LucideCircleDollarSign,
  LucideClock3,
  LucideGraduationCap,
  LucideLanguages,
  LucideMapPin,
  LucideMonitor,
  LucidePlus,
  LucideTrash2,
  LucideUsers,
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
    <div className="flex w-full flex-col items-start gap-3">
      {/* Header With Remove Button Section */}
      <div className="flex w-full items-center justify-between">
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
      <div className="flex w-full flex-col items-start gap-5 border border-border bg-card p-5">
        {/* Role Details Section */}
        <div className="grid w-full grid-cols-12 gap-4 tablet-md:grid-cols-1">
          <LabelInput
            className="col-span-7 tablet-md:col-span-1"
            label={tP("expTitle")}
            input={
              <Input
                placeholder={props.isEdit ? tP("expTitle") : props.title}
                id="title"
                {...register(`openPositions.${props.index}.title`)}
                prefix={<LucideBriefcase />}
                disabled={!props.isEdit}
              />
            }
          />

          {/* Position Type Section */}
          <div className="col-span-5 flex flex-col items-start gap-2 tablet-md:col-span-1">
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
                  icon={<LucideClock3 />}
                  contentClassName="profile-overlay profile-command-popover"
                  disabled={!props.isEdit}
                />
              )}
            />
          </div>

          {/* Description Section */}
          <div className="col-span-12 flex w-full flex-col items-start gap-1 tablet-md:col-span-1">
            <div className="flex w-full items-center justify-between">
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
                  className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
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

          {/* WorkMode and Location Section */}
          <div className="col-span-5 flex flex-col gap-2 tablet-md:col-span-1">
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
                  <SelectTrigger className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto">
                    <div className="flex min-w-0 items-center gap-2">
                      <LucideMonitor className="size-[18px] shrink-0" />
                      <SelectValue placeholder={tP("workModePlaceholder")} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="profile-overlay profile-select-content">
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

          <LabelInput
            className="col-span-7 tablet-md:col-span-1"
            label={tP("jobLocation")}
            input={
              <Input
                placeholder={tP("jobLocationPlaceholder")}
                {...register(`openPositions.${props.index}.location`)}
                prefix={<LucideMapPin />}
                disabled={!props.isEdit}
              />
            }
          />

          {/* Required Languages Section — mirrors the employee languages list
              so a candidate's languages match a role's requirement. */}
          <div className="col-span-12 flex flex-col gap-2 tablet-md:col-span-1">
            <TypographyMuted className="text-xs">
              {tP("languagesRequired")}
            </TypographyMuted>
            <Controller
              control={control}
              name={`openPositions.${props.index}.languagesRequired`}
              render={({ field }) => (
                <MultiSelectCombobox
                  options={languageConstant}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={tP("languagesRequiredPlaceholder")}
                  emptyText={tP("languagesRequiredEmpty")}
                  ariaLabel={tP("languagesRequired")}
                  icon={<LucideLanguages />}
                  contentClassName="profile-overlay profile-command-popover"
                  disabled={!props.isEdit}
                />
              )}
            />
          </div>
        </div>

        {/* Experience and Education Requirements Section */}
        <div className="flex w-full flex-col gap-5 border-t border-border/70 pt-5">
          <div className="grid w-full grid-cols-2 gap-4 tablet-md:grid-cols-1">
            {/* Experience Requirements Section — same scale as an employee's
                years of experience, so the search filter can match. Creatable
                so existing free-text values stay editable rather than blank. */}
            <LabelInput
              label={tP("experienceRequirements")}
              input={
                <Controller
                  name={`openPositions.${props.index}.experienceRequirement`}
                  control={control}
                  render={({ field }) => (
                    <CreatableCombobox
                      options={yearOfExperienceConstant}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder={tP("experienceRequirements")}
                      ariaLabel={tP("experienceRequirements")}
                      icon={<LucideBadgeCheck />}
                      triggerId="experience-requirement"
                      contentClassName="profile-overlay profile-command-popover"
                      disabled={!props.isEdit}
                    />
                  )}
                />
              }
            />
            <LabelInput
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
                  prefix={<LucideGraduationCap />}
                  disabled={!props.isEdit}
                />
              }
            />
          </div>

          {/* Skill Requirements Section */}
          <div className="flex w-full flex-col items-start gap-3">
            <TypographyMuted className="text-xs">
              {tP("skillRequirements")}
            </TypographyMuted>
            <div className="flex flex-wrap gap-2">
              {skills &&
                skills.length > 0 &&
                skills.split(", ").map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center",
                        props.isEdit && "border border-border bg-muted/50 pr-2",
                      )}
                    >
                      <Tag label={item} />
                      {props.isEdit && (
                        <LucideXCircle
                          className="cursor-pointer text-red-500"
                          width={"18px"}
                          onClick={() => removeSkill(item)}
                        />
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Skill Requirements Poppver Section */}
            {props.isEdit && (
              <Popover
                open={openSkillPopOver}
                onOpenChange={setOpenSkillPopOver}
              >
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
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="profile-overlay profile-form-popover flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3"
                >
                  <Input
                    placeholder={tP("enterSkillPlaceholder")}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                  <div className="grid w-full grid-cols-2 gap-2 [&>button]:w-full [&>button]:text-xs">
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
        </div>

        {/* Compensation and Timing Section */}
        <div className="flex w-full flex-col gap-5 border-t border-border/70 pt-5">
          <div className="flex w-full flex-col gap-2">
            <TypographyMuted className="text-xs">
              {tP("salaryRange")}
            </TypographyMuted>
            <div className="grid w-full grid-cols-[minmax(140px,0.45fr)_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 tablet-md:grid-cols-1">
              <Controller
                control={control}
                name={`openPositions.${props.index}.salaryCurrency`}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "USD"}
                    onValueChange={field.onChange}
                    disabled={!props.isEdit}
                  >
                    <SelectTrigger className="h-12 gap-2 text-muted-foreground [&>svg:last-child]:ml-auto">
                      <div className="flex min-w-0 items-center gap-2">
                        <LucideCircleDollarSign className="size-[18px] shrink-0" />
                        <SelectValue placeholder="USD" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="profile-overlay profile-select-content">
                      {salaryCurrencyConstant.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
              <span className="shrink-0 text-sm text-muted-foreground tablet-md:hidden">
                —
              </span>
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

          {/* OpeningCount and Deadline Section */}
          <div className="grid w-full grid-cols-[minmax(180px,0.4fr)_minmax(0,1fr)] gap-4 tablet-md:grid-cols-1">
            <LabelInput
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
                      prefix={<LucideUsers />}
                      disabled={!props.isEdit}
                    />
                  )}
                />
              }
            />

            <div className="flex w-full flex-col items-start gap-2">
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
                      popoverClassName="profile-overlay profile-calendar-popover"
                      calendarClassName="profile-calendar"
                    />
                    {fieldState.error && (
                      <TypographyP className="mt-1 text-xs text-red-500 [&:not(:first-child)]:mt-0">
                        {fieldState.error.message}
                      </TypographyP>
                    )}
                  </>
                )}
              />
            </div>
          </div>
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
      </div>
    </div>
  );
}
