import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ErrorMessage from "@/components/utils/feedback/error-message";
import { SectionTitle } from "@/components/utils/layout/section-title";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideCircleCheck, LucidePlus, LucideZap } from "lucide-react";
import { useState } from "react";
import { BenefitValueChip } from "@/components/utils/data-display/benefit-value-chip";

export default function BenefitValueStepForm({
  getValues,
  setValue,
  trigger,
  errors,
}: IStepFormProps<TCompanySignup>) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("auth");
  const tToast = useTranslations("toast");

  /* -------------------------------- All States ------------------------------ */
  // Benefits
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const [benefitInput, setBenefitInput] = useState<string>("");
  const initialBenefit = getValues?.("benefitsAndValues.benefits") || [];
  const [benefits, setBenefits] = useState<string[]>(initialBenefit);

  // Values
  const [valueInput, setValueInput] = useState<string>("");
  const initialValue = getValues?.("benefitsAndValues.values") || [];
  const [values, setValues] = useState<string[]>(initialValue);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  /* -------------------------------- Methods ------------------------------- */
  // ── Add Benefits ───────────────────────────────────────
  const addBenefits = async () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(tToast("duplicatedBenefit"), {
        description: tToast("pleaseInputAnotherBenefit"),
        action: { label: tToast("tryAgain"), onClick: () => {} },
      });
      return;
    }

    const updated = [...benefits, trimmed];
    setBenefits(updated);
    setValue?.("benefitsAndValues.benefits", updated);

    await trigger?.("benefitsAndValues.benefits");

    setBenefitInput("");
    setOpenBenefitPopOver(false);
  };

  // ── Add Values ─────────────────────────────────────────
  const addValues = async () => {
    const trimmed = valueInput.trim();
    if (!trimmed) return;

    const alreadyExists = values.some(
      (value) => value.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(tToast("duplicatedValue"), {
        description: tToast("pleaseInputAnotherValue"),
        action: { label: tToast("tryAgain"), onClick: () => {} },
      });
      return;
    }

    const updated = [...values, trimmed];
    setValues(updated);
    setValue?.("benefitsAndValues.values", updated);

    await trigger?.("benefitsAndValues.values");

    setValueInput("");
    setOpenValuePopOver(false);
  };

  // ── Remove Benefits ─────────────────────────────────────
  const removeBenefit = async (benefitToRemove: string) => {
    const updated = benefits.filter((bf) => bf !== benefitToRemove);
    setBenefits(updated);
    setValue?.("benefitsAndValues.benefits", updated);

    await trigger?.("benefitsAndValues.benefits");
  };

  // ── Remove Values ───────────────────────────────────────
  const removeValue = async (valueToRemove: string) => {
    const updated = values.filter((value) => value !== valueToRemove);
    setValues(updated);
    setValue?.("benefitsAndValues.values", updated);

    await trigger?.("benefitsAndValues.values");
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex w-full flex-col items-start gap-5">
      {/* Benefit Section */}
      <div className="flex w-full flex-col items-start gap-5 rounded-none border border-l-[5px] border-border border-l-foreground bg-card p-5 shadow-hard sm:p-6">
        <div className="w-full">
          <SectionTitle
            icon={<LucideCircleCheck />}
            title={t("cmpBenefitTitle")}
          />
        </div>
        {/* Benefit List Section */}
        <div className="flex w-full flex-col items-stretch gap-3">
          <div className="flex w-full flex-wrap gap-3">
            {benefits.length > 0 ? (
              benefits.map((benefit) => (
                <BenefitValueChip
                  key={benefit}
                  kind="benefit"
                  label={benefit}
                  onRemove={() => removeBenefit(benefit)}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-2">
                <TypographyMuted className="text-sm">
                  {t("cmpBenefitEmpty")}
                </TypographyMuted>
              </div>
            )}
          </div>

          {/* Add Benefit Dialog Section */}
          <Popover
            open={openBenefitPopOver}
            onOpenChange={setOpenBenefitPopOver}
          >
            <PopoverTrigger asChild>
              <Button
                className="w-full text-xs"
                type="button"
                variant="secondary"
              >
                {t("cmpBenefitAddBtn")}
                <LucidePlus />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3 p-5">
              <Input
                placeholder={t("cmpBenefitPlaceholder")}
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
              />
              <div className="flex items-center gap-1 [&>button]:text-xs">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpenBenefitPopOver(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="button" onClick={addBenefits}>
                  {t("save")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <ErrorMessage>
            {errors?.benefitsAndValues?.benefits?.message}
          </ErrorMessage>
        </div>
      </div>

      {/* Value Section */}
      <div className="flex w-full flex-col items-start gap-5 rounded-none border border-l-[5px] border-border border-l-foreground bg-card p-5 shadow-hard sm:p-6">
        <div className="w-full">
          <SectionTitle icon={<LucideZap />} title={t("cmpValueTitle")} />
        </div>
        {/* Value List Section */}
        <div className="flex w-full flex-col items-stretch gap-3">
          <div className="flex w-full flex-wrap gap-3">
            {values.length > 0 ? (
              values.map((value) => (
                <BenefitValueChip
                  key={value}
                  kind="value"
                  label={value}
                  onRemove={() => removeValue(value)}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-2">
                <TypographyMuted className="text-sm">
                  {t("cmpValueEmpty")}
                </TypographyMuted>
              </div>
            )}
          </div>
          {/* Add Value Section */}
          <Popover open={openValuePopOver} onOpenChange={setOpenValuePopOver}>
            <PopoverTrigger asChild>
              <Button
                className="w-full text-xs"
                type="button"
                variant="secondary"
              >
                {t("cmpValueAddBtn")}
                <LucidePlus />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-[var(--radix-popper-anchor-width)] flex-col items-end gap-3 p-5">
              <Input
                placeholder={t("cmpValuePlaceholder")}
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
              />
              <div className="flex items-center gap-1 [&>button]:text-xs">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenValuePopOver(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="button" onClick={addValues}>
                  {t("save")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
