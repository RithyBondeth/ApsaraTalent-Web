import { TReportReason } from "@/utils/types/moderation/report.type";

/* --------------------------------- Report ---------------------------------- */
export const REPORT_REASONS: { value: TReportReason; labelKey: string }[] = [
  { value: "spam", labelKey: "reasonSpam" },
  { value: "harassment", labelKey: "reasonHarassment" },
  { value: "inappropriate_content", labelKey: "reasonInappropriate" },
  { value: "fake_profile", labelKey: "reasonFakeProfile" },
  { value: "scam", labelKey: "reasonScam" },
  { value: "other", labelKey: "reasonOther" },
] as const;
