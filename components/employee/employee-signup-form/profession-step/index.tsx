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
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
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
import { Check, LucideXCircle, Sparkles, Loader2 } from "lucide-react";
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

  // ── Remove Language ──────────────────────────────────────────
  const removeLanguage = (lang: string) => {
    const updated = (languagesValue ?? []).filter((l) => l !== lang);
    setValue?.("profession.languages", updated, { shouldDirty: true });
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col items-start gap-5">
      {/* Title Section */}
      <TypographyH4>{t("empProfessionTitle")}</TypographyH4>

      {/* Looking For Position Section */}
      <div className="w-full space-y-1">
        <div className="flex items-center justify-between">
          <TypographyMuted className="text-xs">
            {t("empProfessionLookingForPosition")}
          </TypographyMuted>
          {jobValue && (
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
          )}
        </div>
        <Controller
          name="profession.job"
          control={control!}
          render={({ field }) => (
            <Input
              placeholder={t("empProfessionLookingForPositionPlaceholder")}
              id="profession"
              {...field}
              validationMessage={errors!.profession?.job?.message}
            />
          )}
        />
      </div>

      {/* Year of Experience and Availability Section */}
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        {/* Year of Experience Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <div className="w-full flex flex-col items-start gap-2">
            <TypographyMuted className="text-xs">
              {t("empProfessionYearOfExperience")}
            </TypographyMuted>
            <Controller
              name="profession.yearOfExperience"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={yearOfExperienceOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={t("empProfessionYearOfExperiencePlaceholder")}
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
            <TypographyMuted className="text-xs">
              {t("empProfessionAvailability")}
            </TypographyMuted>
            <Controller
              name="profession.availability"
              control={control!}
              render={({ field }) => (
                <CreatableCombobox
                  options={availabilityOptions}
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder={t("empProfessionAvailabilityPlaceholder")}
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
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        {/* Work Mode Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {t("empProfessionWorkMode")}
          </TypographyMuted>
          <Controller
            name="profession.workMode"
            control={control!}
            render={({ field }) => (
              <CreatableCombobox
                options={workModeOptions}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={t("empProfessionWorkModePlaceholder")}
              />
            )}
          />
          <ErrorMessage>{errors!.profession?.workMode?.message}</ErrorMessage>
        </div>

        {/* Notice Period Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {t("empProfessionNoticePeriod")}
          </TypographyMuted>
          <Controller
            name="profession.noticePeriod"
            control={control!}
            render={({ field }) => (
              <CreatableCombobox
                options={noticePeriodOptions}
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder={t("empProfessionNoticePeriodPlaceholder")}
              />
            )}
          />
          <ErrorMessage>
            {errors!.profession?.noticePeriod?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Portfolio URL and LinkedIn URL Section */}
      <div className="w-full flex justify-between items-start gap-5 [&>div]:w-1/2 tablet-sm:flex-col tablet-sm:[&>div]:w-full">
        {/* Portfolio URL Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {t("empProfessionPortfolioUrl")}
          </TypographyMuted>
          <Controller
            name="profession.portfolioUrl"
            control={control!}
            render={({ field }) => (
              <Input
                placeholder={t("empProfessionPortfolioUrlPlaceholder")}
                {...field}
                value={field.value ?? ""}
                validationMessage={errors!.profession?.portfolioUrl?.message}
              />
            )}
          />
        </div>

        {/* LinkedIn URL Section */}
        <div className="w-full flex flex-col items-start gap-2">
          <TypographyMuted className="text-xs">
            {t("empProfessionLinkedinUrl")}
          </TypographyMuted>
          <Controller
            name="profession.linkedinUrl"
            control={control!}
            render={({ field }) => (
              <Input
                placeholder={t("empProfessionLinkedinUrlPlaceholder")}
                {...field}
                value={field.value ?? ""}
                validationMessage={errors!.profession?.linkedinUrl?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Languages Section */}
      <div className="w-full flex flex-col items-start gap-2">
        <TypographyMuted className="text-xs">
          {t("empProfessionLanguages")}
        </TypographyMuted>
        {/* Languages List Section */}
        <div className="flex flex-wrap gap-2 mb-1">
          {(languagesValue ?? []).map((lang) => (
            <div
              key={lang}
              className="flex items-center gap-1 bg-primary/10 rounded-full pl-3 pr-2 py-1"
            >
              <span className="text-xs font-medium text-primary">{lang}</span>
              <LucideXCircle
                className="text-primary/60 cursor-pointer hover:text-primary"
                width="14px"
                onClick={() => removeLanguage(lang)}
              />
            </div>
          ))}
        </div>

        {/* Languages Dropdown Section */}
        <Popover open={langPopoverOpen} onOpenChange={setLangPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-muted-foreground font-normal h-12"
            >
              {t("empProfessionLanguagesPlaceholder")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
        <TypographyMuted className="text-xs">
          {t("empProfessionExpectedSalary")}
        </TypographyMuted>
        <div className="w-full flex items-start gap-3">
          {/* Currency Section */}
          <div className="shrink-0 w-28">
            <Controller
              name="profession.expectedSalaryCurrency"
              control={control!}
              render={({ field }) => (
                <Select
                  value={field.value ?? "USD"}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="h-12">
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
          </div>

          {/* Min Salary Section */}
          <div className="flex-1 flex flex-col gap-1">
            <Controller
              name="profession.expectedSalaryMin"
              control={control!}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder={t("empProfessionExpectedSalaryMinPlaceholder")}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                  validationMessage={
                    errors!.profession?.expectedSalaryMin?.message
                  }
                />
              )}
            />
            <TypographyMuted className="text-[10px] text-center">
              {t("empProfessionExpectedSalaryMin")}
            </TypographyMuted>
          </div>

          <TypographyMuted className="text-sm self-center pt-1">
            —
          </TypographyMuted>

          {/* Max Salary Section */}
          <div className="flex-1 flex flex-col gap-1">
            <Controller
              name="profession.expectedSalaryMax"
              control={control!}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder={t("empProfessionExpectedSalaryMaxPlaceholder")}
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === "" ? null : parseFloat(e.target.value),
                    )
                  }
                  validationMessage={
                    errors!.profession?.expectedSalaryMax?.message
                  }
                />
              )}
            />
            <TypographyMuted className="text-[10px] text-center">
              {t("empProfessionExpectedSalaryMax")}
            </TypographyMuted>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full flex flex-col items-start gap-1">
        <div className="w-full flex items-center justify-between">
          <TypographyMuted className="text-xs">
            {t("empProfessionDescription")}
          </TypographyMuted>
          {descValue && (
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
          )}
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <Controller
            name="profession.description"
            control={control!}
            render={({ field }) => (
              <Textarea
                autoResize
                placeholder={t("empProfessionDescriptionPlaceholder")}
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
