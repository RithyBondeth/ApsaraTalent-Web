import { TProblemCategory } from "@/utils/types/report-problem/report-problem.type";

/* ------------------------------ Support Inbox ------------------------------ */
// Shown only as a fallback address when submitting the report fails; the
// report itself is delivered server-side.
export const SUPPORT_EMAIL = "support@apsaratalent.com";

/* --------------------------- Problem Categories ---------------------------- */
export const PROBLEM_CATEGORIES: {
  value: TProblemCategory;
  labelKey: string;
}[] = [
  { value: "bug", labelKey: "categoryBug" },
  { value: "account", labelKey: "categoryAccount" },
  { value: "payment", labelKey: "categoryPayment" },
  { value: "content", labelKey: "categoryContent" },
  { value: "other", labelKey: "categoryOther" },
] as const;

/** Must stay in sync with the API's @MaxLength(1000) on ReportProblemBodyDTO. */
export const PROBLEM_DESCRIPTION_MAX_LENGTH = 1000;
