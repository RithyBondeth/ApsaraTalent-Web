"use client";

import { TCompanySignup } from "@/app/(auth)/signup/company/validation";
import { IStepFormProps } from "@/components/employee/employee-signup-form/props";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import ErrorMessage from "@/components/utils/error-message";
import IconLabel from "@/components/utils/icon-label";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { LucideCircleCheck, LucidePlus, LucideXCircle } from "lucide-react";
import { useState } from "react";

export default function BenefitValueStepForm({
  getValues,
  setValue,
  trigger,
  errors,
}: IStepFormProps<TCompanySignup>) {
  // Utils
  const t = useTranslations("toast");

  // Benefit and Value Helpers
  const [openBenefitPopOver, setOpenBenefitPopOver] = useState<boolean>(false);
  const [openValuePopOver, setOpenValuePopOver] = useState<boolean>(false);

  const [benefitInput, setBenefitInput] = useState<string>("");
  const initialBenefit = getValues?.("benefitsAndValues.benefits") || [];
  const [benefits, setBenefits] = useState<string[]>(initialBenefit);

  const [valueInput, setValueInput] = useState<string>("");
  const initialValue = getValues?.("benefitsAndValues.values") || [];
  const [values, setValues] = useState<string[]>(initialValue);

  // Handle Add Benefit
  const addBenefits = async () => {
    const trimmed = benefitInput.trim();
    if (!trimmed) return;

    const alreadyExists = benefits.some(
      (bf) => bf.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedBenefit"), {
        description: t("pleaseInputAnotherBenefit"),
        action: { label: t("tryAgain"), onClick: () => {} },
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

  // Handle Add Value
  const addValues = async () => {
    const trimmed = valueInput.trim();
    if (!trimmed) return;

    const alreadyExists = values.some(
      (value) => value.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      toast.error(t("duplicatedValue"), {
        description: t("pleaseInputAnotherValue"),
        action: { label: t("tryAgain"), onClick: () => {} },
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

  // Handle Remove Benefit
  const removeBenefit = async (benefitToRemove: string) => {
    const updated = benefits.filter((bf) => bf !== benefitToRemove);
    setBenefits(updated);
    setValue?.("benefitsAndValues.benefits", updated);

    await trigger?.("benefitsAndValues.benefits");
  };

  // Handle Remove Value
  const removeValue = async (valueToRemove: string) => {
    const updated = values.filter((value) => value !== valueToRemove);
    setValues(updated);
    setValue?.("benefitsAndValues.values", updated);

    await trigger?.("benefitsAndValues.values");
  };

  return (
    <div className="w-full flex flex-col items-start gap-8">
      <div className="w-full flex flex-col items-start gap-3">
        {/* Benefit Section */}
        <TypographyH4>Add company benefit information (Optional)</TypographyH4>
        <div className="flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
              key={benefit}
            >
              <IconLabel
                icon={<LucideCircleCheck stroke="white" fill="#0073E6" />}
                text={benefit}
              />
              <LucideXCircle
                className="text-muted-foreground cursor-pointer"
                width={"18px"}
                onClick={() => removeBenefit(benefit)}
              />
            </div>
          ))}
        </div>

        {/* Add Benefit Dialog Section */}
        <Popover open={openBenefitPopOver} onOpenChange={setOpenBenefitPopOver}>
          <PopoverTrigger asChild>
            <Button
              className="w-full text-xs"
              type="button"
              variant="secondary"
            >
              Add benefit
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input
              placeholder="Enter your benefit (e.g. Unlimited PTO, Yearly Tech Stipend etc.)"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
            />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpenBenefitPopOver(false)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={addBenefits}>
                Save
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <ErrorMessage>
          {errors?.benefitsAndValues?.benefits?.message}
        </ErrorMessage>
      </div>
      <div className="w-full flex flex-col items-start gap-3">
        {/* Value Section */}
        <TypographyH4>Add company value information (Optional)</TypographyH4>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-muted"
              key={value}
            >
              <IconLabel
                icon={<LucideCircleCheck stroke="white" fill="#69B41E" />}
                text={value}
              />
              <LucideXCircle
                className="text-muted-foreground cursor-pointer"
                width={"18px"}
                onClick={() => removeValue(value)}
              />
            </div>
          ))}
        </div>

        {/* Add Value Section */}
        <Popover open={openValuePopOver} onOpenChange={setOpenValuePopOver}>
          <PopoverTrigger asChild>
            <Button
              className="w-full text-xs"
              type="button"
              variant="secondary"
            >
              Add value
              <LucidePlus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-5 flex flex-col items-end gap-3 w-[var(--radix-popper-anchor-width)]">
            <Input
              placeholder="Enter your value (e.g. Insurance, Employee Well-being etc.)"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
            />
            <div className="flex items-center gap-1 [&>button]:text-xs">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenValuePopOver(false)}
              >
                Cancel
              </Button>
              <Button onClick={addValues}>Save</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
