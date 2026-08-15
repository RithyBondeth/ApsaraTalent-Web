"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { formatSalaryRange, type ISalarySource } from "@/utils/functions/text";

/**
 * Returns a translated formatter for a job's pay.
 *
 * The formatting itself lives in `formatSalaryRange` so it stays pure and
 * testable; this only supplies the localized wording for the one-sided and
 * unstated cases. Consumers get a plain string, which is what the chip and
 * badge primitives take.
 */
export function useSalaryText() {
  const t = useTranslations("common");

  return useCallback(
    (source: ISalarySource) =>
      formatSalaryRange(source, {
        from: (amount) => t("salaryFrom", { amount }),
        upTo: (amount) => t("salaryUpTo", { amount }),
        negotiable: t("salaryNegotiable"),
      }),
    [t],
  );
}
