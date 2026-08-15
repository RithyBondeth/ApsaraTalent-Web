import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
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
import Tag from "@/components/utils/data-display/tag";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  availabilityConstant,
  languageConstant,
  salaryCurrencyConstant,
  workModeConstant,
  yearOfExperienceConstant,
} from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getRandomBadgeColor } from "@/utils/functions/ui";
import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  FileText,
  GraduationCap,
  Languages,
  Laptop,
  ListChecks,
  LucidePlus,
  LucideTrash2,
  LucideXCircle,
  MapPin,
  Sparkles,
  Loader2,
  Users,
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

  // Both lists are shared with the employee side on purpose: the job search
  // filters compare these values to `employee.availability` and
  // `employee.yearsOfExperience` by exact string equality.
  const availabilityOptions = availabilityConstant.map((item) => ({
    ...item,
    label: t(
      item.value === "full_time"
        ? "availabilityFullTime"
        : item.value === "part_time"
          ? "availabilityPartTime"
          : item.value === "internship"
            ? "availabilityInternship"
            : item.value === "contract"
              ? "availabilityContract"
              : "availabilityFreelance",
    ),
  }));

  const experienceOptions = yearOfExperienceConstant.map((item) => ({
    ...item,
    label: t(
      item.value === "No Experience"
        ? "yearOfExpNoExperience"
        : item.value === "Less than 1 year"
          ? "yearOfExpLessThan1Year"
          : item.value === "1 - 2 years"
            ? "yearOfExp1To2Years"
            : item.value === "3 - 5 years"
              ? "yearOfExp3To5Years"
              : item.value === "6 - 10 years"
                ? "yearOfExp6To10Years"
                : "yearOfExp10Plus",
    ),
  }));

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
      languagesRequired: [],
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
    <div className="max-h-[min(560px,calc(100dvh-300px))] w-full overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable]">
      <div className="flex w-full flex-col gap-4">
        {/* Title Section */}
        <div className="sticky top-0 z-10 flex w-full items-center justify-between gap-3 border-b border-border bg-card/95 py-2 backdrop-blur-sm">
          <TypographyH4>{t("cmpOpenPositionTitle")}</TypographyH4>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            <span className="text-destructive">*</span>{" "}
            {t("requiredFieldsHint")}
          </span>
        </div>

        {/* Open Position Form Section */}
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="relative flex w-full flex-col items-start gap-3 border-border bg-card/45 p-4 shadow-none"
          >
            {/* Header With Remove Button Section */}
            <div className="flex min-h-8 w-full items-center justify-between gap-3">
              <TypographyMuted className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
                {t("cmpOpenPositionLabel")} {index + 1}
              </TypographyMuted>
              {fields.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => remove(index)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <LucideTrash2 size={16} />
                </Button>
              )}
            </div>

            {/* Position and Type Section */}
            <div className="field-row w-full">
              <Input
                prefix={<BriefcaseBusiness />}
                placeholder={`${t("cmpOpenPositionTitlePlaceholder")} *`}
                aria-label={t("cmpOpenPositionFieldTitle")}
                aria-required="true"
                {...register(`openPositions.${index}.title`)}
                validationMessage={
                  errors?.openPositions?.[index]?.title?.message
                }
              />
              {/* Position Type Section — same vocabulary as an employee's
                  availability, so the job-type search filter can match. */}
              <div className="flex w-full flex-col items-start gap-2">
                <Controller
                  control={control!}
                  name={`openPositions.${index}.types`}
                  render={({ field }) => (
                    <CreatableCombobox
                      options={availabilityOptions}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder={`${t("cmpOpenPositionTypePlaceholder")} *`}
                      emptyText={t("cmpOpenPositionTypeEmpty")}
                      ariaLabel={t("cmpOpenPositionType")}
                      icon={<BadgeCheck />}
                      required
                    />
                  )}
                />
                <ErrorMessage>
                  {errors?.openPositions?.[index]?.types?.message?.toString()}
                </ErrorMessage>
              </div>
            </div>

            {/* Description Section */}
            <Textarea
              prefix={<FileText />}
              placeholder={`${t("cmpOpenPositionDescriptionPlaceholder")} *`}
              aria-label={t("cmpOpenPositionDescription")}
              aria-required="true"
              className="min-h-16 resize-none placeholder:text-sm"
              action={
                openPositionsValues?.[index]?.description ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRefine(index)}
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
                ) : undefined
              }
              {...register(`openPositions.${index}.description`)}
              validationMessage={
                errors?.openPositions?.[index]?.description?.message
              }
            />

            {/* Experience and Education Section */}
            <div className="field-row w-full">
              {/* Experience Section — same scale as an employee's years of
                  experience, so candidate and requirement compare directly. */}
              <div className="flex w-full flex-col items-start gap-2">
                <Controller
                  control={control!}
                  name={`openPositions.${index}.experienceRequirement`}
                  render={({ field }) => (
                    <CreatableCombobox
                      options={experienceOptions}
                      value={field.value || ""}
                      onChange={field.onChange}
                      placeholder={`${t("cmpOpenPositionExpPlaceholder")} *`}
                      emptyText={t("cmpOpenPositionExpEmpty")}
                      ariaLabel={t("cmpOpenPositionExpRequired")}
                      icon={<BarChart3 />}
                      required
                    />
                  )}
                />
                <ErrorMessage>
                  {
                    errors?.openPositions?.[index]?.experienceRequirement
                      ?.message
                  }
                </ErrorMessage>
              </div>
              <Input
                prefix={<GraduationCap />}
                placeholder={`${t("cmpOpenPositionEduPlaceholder")} *`}
                aria-label={t("cmpOpenPositionEduRequired")}
                aria-required="true"
                {...register(`openPositions.${index}.educationRequirement`)}
                validationMessage={
                  errors?.openPositions?.[index]?.educationRequirement?.message
                }
              />
            </div>

            {/* Structured Salary Section (Currency / Min / Max) */}
            <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 sm:grid-cols-[7rem_minmax(0,1fr)_auto_minmax(0,1fr)]">
              <Controller
                control={control!}
                name={`openPositions.${index}.salaryCurrency`}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "USD"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="col-span-3 h-12 w-full sm:col-span-1"
                      aria-label={t("cmpOpenPositionSalaryCurrency")}
                    >
                      <CircleDollarSign className="mr-2 size-[18px] shrink-0" />
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      {salaryCurrencyConstant.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <Controller
                control={control!}
                name={`openPositions.${index}.salaryMin`}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={t("cmpOpenPositionSalaryMin")}
                    aria-label={t("cmpOpenPositionSalaryMin")}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    validationMessage={
                      errors?.openPositions?.[index]?.salaryMin?.message
                    }
                  />
                )}
              />
              <span className="flex h-12 shrink-0 items-center text-sm text-muted-foreground">
                —
              </span>
              <Controller
                control={control!}
                name={`openPositions.${index}.salaryMax`}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={t("cmpOpenPositionSalaryMax")}
                    aria-label={t("cmpOpenPositionSalaryMax")}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    validationMessage={
                      errors?.openPositions?.[index]?.salaryMax?.message
                    }
                  />
                )}
              />
            </div>

            {/* Work Mode and Deadline Section */}
            <div className="field-row w-full items-start">
              <Controller
                control={control!}
                name={`openPositions.${index}.workMode`}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="h-12 text-muted-foreground"
                      aria-label={t("cmpOpenPositionWorkMode")}
                    >
                      <Laptop className="mr-2 size-[18px] shrink-0" />
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

              {/* Deadline Section */}
              <div className="flex w-full flex-col gap-1">
                <Controller
                  control={control!}
                  name={`openPositions.${index}.deadlineDate`}
                  render={({ field }) => (
                    <DatePicker
                      placeholder={`${t("cmpOpenPositionDeadlinePlaceholder")} *`}
                      aria-label={t("cmpOpenPositionDeadlineDate")}
                      aria-required="true"
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

            {/* Required Languages Section — mirrors the employee languages
                list so a candidate's languages match a role's requirement. */}
            <div className="flex w-full flex-col items-start gap-2">
              <Controller
                control={control!}
                name={`openPositions.${index}.languagesRequired`}
                render={({ field }) => (
                  <MultiSelectCombobox
                    options={languageConstant}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder={t("cmpOpenPositionLanguagesPlaceholder")}
                    emptyText={t("cmpOpenPositionLanguagesEmpty")}
                    ariaLabel={t("cmpOpenPositionLanguages")}
                    icon={<Languages />}
                  />
                )}
              />
              <ErrorMessage>
                {errors?.openPositions?.[index]?.languagesRequired?.message}
              </ErrorMessage>
            </div>

            {/* Location and Openings Count Section */}
            <div className="field-row w-full">
              <Input
                prefix={<MapPin />}
                placeholder={t("cmpOpenPositionLocationPlaceholder")}
                aria-label={t("cmpOpenPositionLocation")}
                {...register(`openPositions.${index}.location`)}
              />
              <Controller
                control={control!}
                name={`openPositions.${index}.openingsCount`}
                render={({ field }) => (
                  <Input
                    type="number"
                    prefix={<Users />}
                    placeholder={t("cmpOpenPositionOpeningsCountPlaceholder")}
                    aria-label={t("cmpOpenPositionOpeningsCount")}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? null
                          : parseInt(e.target.value, 10),
                      )
                    }
                    validationMessage={
                      errors?.openPositions?.[index]?.openingsCount?.message
                    }
                  />
                )}
              />
            </div>

            {/* Skills Section */}
            <div className="flex w-full min-w-0 flex-col gap-2 border-t border-border/70 pt-3">
              <div className="flex flex-wrap gap-2">
                {(getValues?.(`openPositions.${index}.skills`) || []).map(
                  (skill, skillIndex) => {
                    const { bg } = getRandomBadgeColor(skill);
                    return (
                      <div
                        key={`${skill}-${skillIndex}`}
                        className={`flex items-center ${bg} pr-2`}
                      >
                        <Tag label={skill} />
                        <LucideXCircle
                          className="cursor-pointer text-red-500"
                          width="18px"
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
                    className="h-12 w-full justify-between px-3 text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ListChecks className="size-[18px] text-muted-foreground" />
                      {t("cmpOpenPositionAddSkillBtn")} *
                    </span>
                    <LucidePlus size={14} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-[var(--radix-popper-anchor-width)] flex-col gap-3 p-4">
                  <Input
                    placeholder={t("cmpOpenPositionSkillPlaceholder")}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
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
                {errors?.openPositions?.[index]?.skills?.message}
              </ErrorMessage>
            </div>
          </Card>
        ))}

        {/* Add More Button Section */}
        <div className="flex w-full justify-end">
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
    </div>
  );
}
