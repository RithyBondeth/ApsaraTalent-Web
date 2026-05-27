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
import IconLabel from "@/components/utils/data-display/icon-label";
import { SectionTitle } from "@/components/utils/layout/section-title";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import {
  LucideCircleCheck,
  LucidePlus,
  LucideXCircle,
  LucideZap,
} from "lucide-react";
import { useState } from "react";
import { COMPANY_ICON_COLOR } from "@/utils/constants/ui.constant";

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

  /* --------------------------------- Methods --------------------------------- */
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
    <div className="w-full flex flex-col items-start gap-5">
      {/* Benefit Section */}
      <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5">
        <div className="w-full">
          <SectionTitle
            icon={<LucideCircleCheck />}
            title={t("cmpBenefitTitle")}
          />
        </div>
        {/* Benefit List Section */}
        <div className="w-full flex flex-col items-stretch gap-3">
          <div className="w-full flex flex-wrap gap-3">
            {benefits.length > 0 ? (
              benefits.map((benefit) => (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs"
                  key={benefit}
                >
                  <IconLabel
                    icon={
                      <LucideCircleCheck
                        stroke="white"
                        fill={COMPANY_ICON_COLOR.BENEFIT}
                      />
                    }
                    className="[&>p]:text-[#0073E6] font-medium"
                    text={benefit}
                  />
                  <LucideXCircle
                    className="text-red-500 cursor-pointer"
                    width={"18px"}
                    onClick={() => removeBenefit(benefit)}
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center py-2">
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
            <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
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
      <div className="w-full bg-card rounded-2xl border border-border/60 shadow-sm p-5 sm:p-6 flex flex-col items-start gap-5">
        <div className="w-full">
          <SectionTitle icon={<LucideZap />} title={t("cmpValueTitle")} />
        </div>
        {/* Value List Section */}
        <div className="w-full flex flex-col items-stretch gap-3">
          <div className="w-full flex flex-wrap gap-3">
            {values.length > 0 ? (
              values.map((value) => (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted cursor-pointer [&>div>p]:text-xs"
                  key={value}
                >
                  <IconLabel
                    icon={
                      <LucideCircleCheck
                        stroke="white"
                        fill={COMPANY_ICON_COLOR.VALUE}
                      />
                    }
                    className="[&>p]:text-[#69B41E] font-medium"
                    text={value}
                  />
                  <LucideXCircle
                    className="text-red-500 cursor-pointer"
                    width={"18px"}
                    onClick={() => removeValue(value)}
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex items-center justify-center py-2">
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
            <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
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
