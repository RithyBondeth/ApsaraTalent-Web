import { salaryCurrencyConstant } from "@/utils/constants/ui.constant";

/* ---------------------------------- Types ---------------------------------- */
export interface ISalarySource {
  /**
   * Postgres `numeric` columns come back as strings through TypeORM, so these
   * arrive as "800.00" as often as they do as 800.
   */
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string | null;
  /** Legacy free-text range, kept as a fallback for rows predating the split. */
  salary?: string | null;
}

export interface ISalaryLabels {
  from: (amount: string) => string;
  upTo: (amount: string) => string;
  negotiable: string;
}

/* --------------------------------- Helpers --------------------------------- */
function toAmount(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatAmount(amount: number, currency: string | null): string {
  const match = salaryCurrencyConstant.find((c) => c.value === currency);
  const symbol = match?.symbol ?? "";

  // Salaries are whole numbers in practice; only show cents when they exist,
  // so a persisted "800.00" reads as "$800" rather than "$800.00".
  const text = Number.isInteger(amount)
    ? amount.toLocaleString("en-US")
    : amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

  if (!symbol) return text;
  // Riel conventionally trails the amount; the dollar sign leads it.
  return match?.value === "KHR" ? `${text}${symbol}` : `${symbol}${text}`;
}

/* --------------------------------- Method ---------------------------------- */
/**
 * Renders a job's pay as a single display string.
 *
 * Prefers the structured `salaryMin` / `salaryMax` / `salaryCurrency` columns
 * and falls back to the legacy free-text `salary` string, which is all that
 * older postings have. Returns the negotiable label when a posting states
 * nothing at all, so a chip never renders empty.
 */
export function formatSalaryRange(
  source: ISalarySource,
  labels: ISalaryLabels,
): string {
  const currency = source.salaryCurrency ?? null;
  const min = toAmount(source.salaryMin);
  const max = toAmount(source.salaryMax);

  if (min !== null && max !== null) {
    return min === max
      ? formatAmount(min, currency)
      : `${formatAmount(min, currency)} – ${formatAmount(max, currency)}`;
  }

  if (min !== null) return labels.from(formatAmount(min, currency));
  if (max !== null) return labels.upTo(formatAmount(max, currency));

  const legacy = source.salary?.trim();
  if (legacy) return legacy;

  return labels.negotiable;
}
