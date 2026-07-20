export type TProblemCategory =
  | "bug"
  | "account"
  | "payment"
  | "content"
  | "other";

export type TReportProblemPayload = {
  category: TProblemCategory;
  details: string;
  /** Diagnostic context captured client-side; both are best-effort. */
  pageUrl?: string;
  userAgent?: string;
};
