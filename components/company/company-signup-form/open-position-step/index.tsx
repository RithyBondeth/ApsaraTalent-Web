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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/utils/feedback/error-message";
import LabelInput from "@/components/utils/forms/label-input";
import Tag from "@/components/utils/data-display/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  salaryCurrencyConstant,
  workModeConstant,
} from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getRandomBadgeColor } from "@/utils/functions/ui";
import {
  LucidePlus,
  LucideTrash2,
  LucideXCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";

export default function OpenPositionStepForm({
  register,
  control,
  errors,
  setValue,
  getValues,
  trigger,
}: IStepFormProps<TCompanySignup>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tr = useTranslations("resumeBuilder");
  const tToast = useTranslations("toast");

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining, refineContent } = useAIRefine();

  /* -------------------------------- All States ------------------------------ */
  const [skillInput, setSkillInput] = useState<string>("");
  const [openPopOvers, setOpenPopOvers] = useState<boolean[]>([]);

  /* ----------------------------- React Hook Form ----------------------------- */
  const { fields, append, remove } = useFieldArray({
    control: control!,
    name: "openPositions",
  });

  const openPositionsValues = useWatch({ control, name: "openPositions" });

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
      toast.error(tToast("duplicatedSkill"), {
        description: tToast("pleaseInputAnotherSkill"),
        action: { label: tToast("tryAgain"), onClick: () => {} },
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
      salaryMin: undefined,
      salaryMax: undefined,
      salaryCurrency: "USD",
      workMode: undefined,
      location: "",
      openingsCount: undefined,
      deadlineDate: "" as unknown as Date,
    });

    setOpenPopOvers((prevState) => [...prevState, false]);
  };

  // ── Refine Description ───────────────────────────────────
  const handleRefine = async (index: number) => {
    const desc = openPositionsValues?.[index]?.description ?? "";
    const result = await refineContent(desc, "experience");
    if (result && typeof result === "string" && setValue) {
      setValue(`openPositions.${index}.description`, result, {
        shouldDirty: true,
      });
      toast.success(tr("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col gap-5 w-full max-h-[500px] overflow-y-auto pr-1">
      {/* Title Section */}
      <TypographyH4>{t("cmpOpenPositionTitle")}</TypographyH4>

      {/* Open Position Form Section */}
      {fields.map((field, index) => (
        <Card
          key={field.id}
          className="relative flex flex-col items-start gap-3 w-full p-5"
        >
          {/* Header With Remove Button Section */}
          {fields.length > 1 && (
            <div className="w-full flex items-center justify-between mb-3">
              <TypographyMuted className="text-md font-bold text-foreground">
                {t("cmpOpenPositionLabel")} {index + 1}
              </TypographyMuted>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => remove(index)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LucideTrash2 size={16} />
              </Button>
            </div>
          )}

          {/* Title Section */}
          <LabelInput
            label={t("cmpOpenPositionFieldTitle")}
            input={
              <Input
                placeholder={t("cmpOpenPositionTitlePlaceholder")}
                {...register(`openPositions.${index}.title`)}
                validationMessage={
                  errors?.openPositions?.[index]?.title?.message
                }
              />
            }
          />

          {/* Availability Section */}
          <LabelInput
            label={t("cmpOpenPositionType")}
            input={
              <Input
                placeholder={t("cmpOpenPositionTypePlaceholder")}
                {...register(`openPositions.${index}.types`)}
                validationMessage={errors?.openPositions?.[
                  index
                ]?.types?.message?.toString()}
              />
            }
          />

          {/* Description Section */}
          <div className="w-full flex flex-col items-start gap-1">
            <div className="w-full flex items-center justify-between">
              <TypographyMuted className="text-xs">
                {t("cmpOpenPositionDescription")}
              </TypographyMuted>
              {openPositionsValues?.[index]?.description && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRefine(index)}
                  disabled={isRefining}
                  className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
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
              placeholder={t("cmpOpenPositionDescriptionPlaceholder")}
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
              label={t("cmpOpenPositionExpRequired")}
              input={
                <Input
                  placeholder={t("cmpOpenPositionExpPlaceholder")}
                  {...register(`openPositions.${index}.experienceRequirement`)}
                  validationMessage={
                    errors?.openPositions?.[index]?.experienceRequirement
                      ?.message
                  }
                />
              }
            />
            <LabelInput
              label={t("cmpOpenPositionEduRequired")}
              input={
                <Input
                  placeholder={t("cmpOpenPositionEduPlaceholder")}
                  {...register(`openPositions.${index}.educationRequirement`)}
                  validationMessage={
                    errors?.openPositions?.[index]?.educationRequirement
                      ?.message
                  }
                />
              }
            />
          </div>

          {/* Structured Salary Section (Min / Max / Currency) */}
          <div className="w-full flex flex-col gap-2">
            <TypographyMuted className="text-xs">
              {t("cmpOpenPositionSalaryMin")} / {t("cmpOpenPositionSalaryMax")}
            </TypographyMuted>
            {/* Currency Section */}
            <Controller
              control={control!}
              name={`openPositions.${index}.salaryCurrency`}
              render={({ field }) => (
                <Select
                  value={field.value ?? "USD"}
                  onValueChange={field.onChange}
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
            {/* Min — Max Section */}
            <div className="w-full flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Controller
                  control={control!}
                  name={`openPositions.${index}.salaryMin`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder={t("cmpOpenPositionSalaryMinPlaceholder")}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  )}
                />
              </div>
              <span className="text-muted-foreground text-sm shrink-0">—</span>
              <div className="flex-1 min-w-0">
                <Controller
                  control={control!}
                  name={`openPositions.${index}.salaryMax`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder={t("cmpOpenPositionSalaryMaxPlaceholder")}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseFloat(e.target.value),
                        )
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Work Mode, Location, Openings Count Section */}
          <div className="w-full flex gap-3 [&>div]:flex-1 tablet-md:flex-col">
            {/* Work Mode Section */}
            <div className="flex flex-col gap-1">
              <TypographyMuted className="text-xs">
                {t("cmpOpenPositionWorkMode")}
              </TypographyMuted>
              <Controller
                control={control!}
                name={`openPositions.${index}.workMode`}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="h-12 text-muted-foreground">
                      <SelectValue
                        placeholder={t("cmpOpenPositionWorkModePlaceholder")}
                      />
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
            {/* Location Section */}
            <LabelInput
              label={t("cmpOpenPositionLocation")}
              input={
                <Input
                  placeholder={t("cmpOpenPositionLocationPlaceholder")}
                  {...register(`openPositions.${index}.location`)}
                />
              }
            />
            {/* Openings Count Section */}
            <LabelInput
              label={t("cmpOpenPositionOpeningsCount")}
              input={
                <Controller
                  control={control!}
                  name={`openPositions.${index}.openingsCount`}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder={t("cmpOpenPositionOpeningsCountPlaceholder")}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : parseInt(e.target.value, 10),
                        )
                      }
                    />
                  )}
                />
              }
            />
          </div>

          {/* Deadline Date Section */}
          <div className="w-full flex flex-col gap-2">
            <TypographyMuted className="text-xs">
              {t("cmpOpenPositionDeadlineDate")}
            </TypographyMuted>
            <Controller
              control={control!}
              name={`openPositions.${index}.deadlineDate`}
              render={({ field }) => (
                <DatePicker
                  placeholder={t("cmpOpenPositionDeadlinePlaceholder")}
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

          {/* Skill Tags and Add Skill Section */}
          <div className="w-full flex flex-col gap-2">
            <TypographyMuted className="text-xs">
              {t("cmpOpenPositionSkillsRequired")}
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
                  {t("cmpOpenPositionAddSkillBtn")}
                  <LucidePlus size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-5 flex flex-col gap-3 w-[var(--radix-popper-anchor-width)]">
                <Input
                  placeholder={t("cmpOpenPositionSkillPlaceholder")}
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
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => addSkill(index)}
                  >
                    {t("save")}
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
          {t("addMore")}
          <LucidePlus size={14} />
        </Button>
      </div>
    </div>
  );
}
