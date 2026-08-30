/**
 * Mirrors EProblemCategory in the API. Kept as a literal union rather than an
 * enum so the values are the wire format and nothing has to be mapped.
 */
export const PROBLEM_CATEGORIES = [
  "bug",
  "account",
  "payment",
  "content",
  "other",
] as const;

export type TProblemCategory = (typeof PROBLEM_CATEGORIES)[number];

/** The server caps details at 1000 characters; the form counts against this. */
export const PROBLEM_DETAILS_MAX = 1000;
