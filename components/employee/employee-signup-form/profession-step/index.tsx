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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import {
  workModeConstant,
  noticePeriodConstant,
  languageConstant,
  salaryCurrencyConstant,
} from "@/utils/constants/ui.constant";
import { useTranslations } from "next-intl";
import { Controller, useWatch } from "react-hook-form";
import { IStepFormProps } from "../props";
import { useAIRefine } from "@/hooks/utils/use-ai-refine";
import {
  AlignLeft,
  BarChart3,
  Briefcase,
  CalendarClock,
  Check,
  CircleDollarSign,
  Clock3,
  Languages,
  Laptop,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

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

  /* --------------------------------- All State -------------------------------- */
  const [langPopoverOpen, setLangPopoverOpen] = useState<boolean>(false);

  /* ----------------------------- API Integration ---------------------------- */
  const { isRefining: jobLoading, refineContent: refineJob } = useAIRefine();
  const { isRefining: descLoading, refineContent: refineDesc } = useAIRefine();

  /* ------------------------------ React Hook Form ---------------------------- */
  const jobValue = useWatch({ control, name: "profession.job" });
  const descValue = useWatch({ control, name: "profession.description" });
  const languagesValue = useWatch({ control, name: "profession.languages" }) as
    | string[]
    | undefined;

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

  // ── Toggle Language ──────────────────────────────────────────
  const toggleLanguage = (lang: string) => {
    const current = languagesValue ?? [];
    const updated = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    setValue?.("profession.languages", updated, { shouldDirty: true });
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
              prefix={<Briefcase />}
              suffix={
                jobValue ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleJobRefine}
                    disabled={jobLoading}
                    className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
                  >
                    {jobLoading ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Sparkles size={10} />
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
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <Controller
              name="profession.yearOfExperience"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={yearOfExperienceOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={`${t("empProfessionYearOfExperiencePlaceholder")} *`}
                  icon={<BarChart3 />}
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
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <Controller
              name="profession.availability"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={`${t("empProfessionAvailabilityPlaceholder")} *`}
                  icon={<CalendarClock />}
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
        {/* Work Mode Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <Controller
            name="profession.workMode"
            control={control!}
            render={({ field }) => (
              <CreatableCombobox
                options={workModeOptions}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={t("empProfessionWorkModePlaceholder")}
                icon={<Laptop />}
              />
            )}
          />
          <ErrorMessage>{errors!.profession?.workMode?.message}</ErrorMessage>
        </div>

        {/* Notice Period Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <Controller
            name="profession.noticePeriod"
            control={control!}
            render={({ field }) => (
              <CreatableCombobox
                options={noticePeriodOptions}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={t("empProfessionNoticePeriodPlaceholder")}
                icon={<Clock3 />}
              />
            )}
          />
          <ErrorMessage>
            {errors!.profession?.noticePeriod?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Languages and Expected Salary Section */}
      <div className="grid w-full gap-4">
        <div className="w-full flex flex-col items-start gap-2">
          {/* Languages Dropdown Section */}
          <Popover open={langPopoverOpen} onOpenChange={setLangPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-muted-foreground font-normal h-12"
              >
                <Languages />
                <span className="truncate">
                  {(languagesValue ?? []).length > 0
                    ? (languagesValue ?? []).join(", ")
                    : t("empProfessionLanguagesPlaceholder")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[var(--radix-popover-trigger-width)] p-0"
            >
              <Command>
                <CommandInput
                  placeholder={t("empProfessionLanguagesPlaceholder")}
                />
                <CommandList>
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languageConstant.map((lang) => (
                      <CommandItem
                        key={lang}
                        value={lang}
                        onSelect={() => toggleLanguage(lang)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            (languagesValue ?? []).includes(lang)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {lang}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <ErrorMessage>{errors!.profession?.languages?.message}</ErrorMessage>
        </div>

        {/* Expected Salary Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="auth-salary-grid grid w-full grid-cols-[108px_minmax(0,1fr)_minmax(0,1fr)] items-start gap-2">
            {/* Currency Section */}
            <div>
              <Controller
                name="profession.expectedSalaryCurrency"
                control={control!}
                render={({ field }) => (
                  <Select
                    value={field.value ?? "USD"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="h-12"
                      aria-label={t("empProfessionExpectedSalary")}
                    >
                      <CircleDollarSign className="mr-1 size-4 shrink-0 text-muted-foreground" />
                      <SelectValue>{field.value ?? "USD"}</SelectValue>
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
            </div>

            {/* Min Salary Section */}
            <div className="flex-1 flex flex-col gap-1">
              <Controller
                name="profession.expectedSalaryMin"
                control={control!}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={t("empProfessionExpectedSalaryMin")}
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
                      errors!.profession?.expectedSalaryMin?.message
                    }
                  />
                )}
              />
            </div>

            {/* Max Salary Section */}
            <div className="auth-salary-max flex min-w-0 flex-col gap-1">
              <Controller
                name="profession.expectedSalaryMax"
                control={control!}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder={t("empProfessionExpectedSalaryMax")}
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
                      errors!.profession?.expectedSalaryMax?.message
                    }
                  />
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full flex flex-col items-start gap-1">
        <div className="w-full flex flex-col items-start gap-2">
          <Controller
            name="profession.description"
            control={control!}
            render={({ field }) => (
              <Textarea
                autoResize
                placeholder={`${t("empProfessionDescriptionPlaceholder")} *`}
                prefix={<AlignLeft />}
                action={
                  descValue ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleDescRefine}
                      disabled={descLoading}
                      className="h-6 px-1.5 text-[9px] gap-1 text-primary hover:text-primary hover:bg-primary/5"
                    >
                      {descLoading ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} />
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
