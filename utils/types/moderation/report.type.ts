export type TReportReason =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "fake_profile"
  | "scam"
  | "other";

export type TReportUserPayload = {
  reportedId: string;
  reason: TReportReason;
  details?: string;
};
