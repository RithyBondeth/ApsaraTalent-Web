import { TEmployeeSignUp } from "@/app/(auth)/signup/employee/validation";
import { CreatableCombobox } from "@/components/ui/creatable-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import {
  workModeConstant,
  noticePeriodConstant,
  languageConstant,
} from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import { IStepFormProps } from "../props";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import {
  LucideAlignLeft,
  LucideBarChart3,
  LucideBriefcase,
  LucideCalendarClock,
  LucideClock3,
  LucideLanguages,
  LucideLaptop,
  LucideLoader2,
  LucideSparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ProfessionStepForm({
  control,
  errors,
  setValue,
}: IStepFormProps<TEmployeeSignUp>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tr = useTranslations("resumeBuilder");
  const availabilityOptions = [
    { id: 1, label: t("availabilityFullTime"), value: "full_time" },
    { id: 2, label: t("availabilityPartTime"), value: "part_time" },
    { id: 3, label: t("availabilityInternship"), value: "internship" },
    { id: 4, label: t("availabilityContract"), value: "contract" },
    { id: 5, label: t("availabilityFreelance"), value: "freelance" },
  ];

  const yearOfExperienceOptions = [
    { id: 1, label: t("yearOfExpNoExperience"), value: "No Experience" },
    { id: 2, label: t("yearOfExpLessThan1Year"), value: "Less than 1 year" },
    { id: 3, label: t("yearOfExp1To2Years"), value: "1 - 2 years" },
    { id: 4, label: t("yearOfExp3To5Years"), value: "3 - 5 years" },
    { id: 5, label: t("yearOfExp6To10Years"), value: "6 - 10 years" },
    { id: 6, label: t("yearOfExp10Plus"), value: "10+ years" },
  ];

  const workModeOptions = workModeConstant.map((item) => ({
    ...item,
    label: t(
      item.value === "remote"
        ? "workModeRemote"
        : item.value === "on_site"
          ? "workModeOnSite"
          : item.value === "hybrid"
            ? "workModeHybrid"
            : "workModeFlexible",
    ),
  }));

  const noticePeriodOptions = noticePeriodConstant.map((item) => ({
    ...item,
    label: t(
      item.value === "immediate"
        ? "noticePeriodImmediate"
        : item.value === "2_weeks"
          ? "noticePeriodTwoWeeks"
          : "noticePeriodOneMonth",
    ),
  }));

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining: jobLoading, refineContent: refineJob } = useAIRefine();
  const { isRefining: descLoading, refineContent: refineDesc } = useAIRefine();

  /* ------------------------------ React Hook Form ---------------------------- */
  const jobValue = useWatch({ control, name: "profession.job" });
  const descValue = useWatch({ control, name: "profession.description" });

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Job Refine ─────────────────────────────────────────
  const handleJobRefine = async () => {
    const result = await refineJob(jobValue, "jobTitle");
    if (result && typeof result === "string" && setValue) {
      setValue("profession.job", result, { shouldDirty: true });
      toast.success(tr("refinedSuccess"));
    }
  };

  // ── Handle Description Refine ────────────────────────────────
  const handleDescRefine = async () => {
    const result = await refineDesc(descValue, "summary");
    if (result && typeof result === "string" && setValue) {
      setValue("profession.description", result, { shouldDirty: true });
      toast.success(tr("refinedSuccess"));
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-start gap-4">
      {/* Title Section */}
      <div className="flex w-full items-center justify-between gap-3">
        <TypographyH4>{t("empProfessionTitle")}</TypographyH4>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          <span className="text-destructive">*</span> {t("requiredFieldsHint")}
        </span>
      </div>

      {/* Looking For Position Section */}
      <div className="w-full space-y-1">
        <Controller
          name="profession.job"
          control={control!}
          render={({ field }) => (
            <Input
              placeholder={`${t("empProfessionLookingForPositionPlaceholder")} *`}
              prefix={<LucideBriefcase />}
              suffix={
                jobValue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleJobRefine}
                    disabled={jobLoading}
                    className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                  >
                    {jobLoading ? (
                      <LucideLoader2 size={10} className="animate-spin" />
                    ) : (
                      <LucideSparkles size={10} />
                    )}
                    {tr("aiRefine")}
                  </Button>
                ) : undefined
              }
              aria-required="true"
              id="profession"
              {...field}
              validationMessage={errors!.profession?.job?.message}
            />
          )}
        />
      </div>

      {/* Year of Experience and Availability Section */}
      <div className="field-row w-full">
        {/* Year of Experience Section */}
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-2">
            <Controller
              name="profession.yearOfExperience"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={yearOfExperienceOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={`${t("empProfessionYearOfExperiencePlaceholder")} *`}
                  icon={<LucideBarChart3 />}
                  required
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.yearOfExperience?.message}
          </ErrorMessage>
        </div>

        {/* Availability Section */}
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-2">
            <Controller
              name="profession.availability"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={`${t("empProfessionAvailabilityPlaceholder")} *`}
                  icon={<LucideCalendarClock />}
                  required
                />
              )}
            />
          </div>
          <ErrorMessage>
            {errors!.profession?.availability?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Work Mode and Notice Period Section */}
      <div className="field-row w-full">
        {/* Work Mode Section — a fixed set of four, matching what a company
            picks for an open position. Not creatable: a custom value could
            never be matched or filtered against a job. */}
        <div className="flex w-full flex-col items-start gap-2">
          <Controller
            name="profession.workMode"
            control={control!}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  className="h-12 text-muted-foreground"
                  aria-label={t("empProfessionWorkMode")}
                >
                  <LucideLaptop className="mr-2 size-[18px] shrink-0" />
                  <SelectValue
                    placeholder={t("empProfessionWorkModePlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {workModeOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>{errors!.profession?.workMode?.message}</ErrorMessage>
        </div>

        {/* Notice Period Section — also a closed set; the API validates it
            against ENoticePeriod, so a typed-in value would 400. */}
        <div className="flex w-full flex-col items-start gap-2">
          <Controller
            name="profession.noticePeriod"
            control={control!}
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger
                  className="h-12 text-muted-foreground"
                  aria-label={t("empProfessionNoticePeriod")}
                >
                  <LucideClock3 className="mr-2 size-[18px] shrink-0" />
                  <SelectValue
                    placeholder={t("empProfessionNoticePeriodPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {noticePeriodOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <ErrorMessage>
            {errors!.profession?.noticePeriod?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Languages Section — the same list a company picks from when stating
          a role's language requirements, so the two compare directly. */}
      <div className="flex w-full flex-col items-start gap-2">
        <Controller
          name="profession.languages"
          control={control!}
          render={({ field }) => (
            <MultiSelectCombobox
              options={languageConstant}
              value={field.value ?? []}
              onChange={field.onChange}
              placeholder={t("empProfessionLanguagesPlaceholder")}
              emptyText={t("empProfessionLanguagesEmpty")}
              ariaLabel={t("empProfessionLanguages")}
              icon={<LucideLanguages />}
            />
          )}
        />
        <ErrorMessage>{errors!.profession?.languages?.message}</ErrorMessage>
      </div>

      {/* Description Section */}
      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full flex-col items-start gap-2">
          <Controller
            name="profession.description"
            control={control!}
            render={({ field }) => (
              <Textarea
                autoResize
                placeholder={`${t("empProfessionDescriptionPlaceholder")} *`}
                prefix={<LucideAlignLeft />}
                action={
                  descValue ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDescRefine}
                      disabled={descLoading}
                      className="h-6 gap-1 px-1.5 text-[9px] text-primary hover:bg-primary/5 hover:text-primary"
                    >
                      {descLoading ? (
                        <LucideLoader2 size={10} className="animate-spin" />
                      ) : (
                        <LucideSparkles size={10} />
                      )}
                      {tr("aiRefine")}
                    </Button>
                  ) : undefined
                }
                aria-required="true"
                {...field}
                className="placeholder:text-sm"
                validationMessage={errors!.profession?.description?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
