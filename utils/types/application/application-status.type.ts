/**
 * The stages an application moves through, mirroring `EApplicationStatus` on
 * the API.
 *
 * `reviewed` is legacy — nothing transitions into it any more, and the question
 * it answered is now carried by `reviewedAt`. It stays in the union because
 * rows created before the pipeline existed can still hold it.
 */
export type TApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interviewing"
  | "offered"
  | "rejected"
  | "hired"
  | "withdrawn";

/** The order stages appear in the pipeline, for sorting and for the stage rail. */
export const APPLICATION_STAGE_ORDER: TApplicationStatus[] = [
  "pending",
  "reviewed",
  "shortlisted",
  "interviewing",
  "offered",
  "hired",
];

/**
 * What a company may move each stage into — the browser's copy of
 * `APPLICATION_STATUS_TRANSITIONS`, so the dropdown only ever offers moves the
 * API will accept. The API remains the authority; this exists to keep the UI
 * from presenting a choice that is going to 400.
 */
export const APPLICATION_STATUS_TRANSITIONS: Record<
  TApplicationStatus,
  TApplicationStatus[]
> = {
  pending: ["shortlisted", "rejected"],
  reviewed: ["shortlisted", "rejected"],
  shortlisted: ["interviewing", "rejected"],
  interviewing: ["offered", "rejected"],
  offered: ["hired", "rejected"],
  hired: [],
  rejected: [],
  withdrawn: [],
};

/** Stages an application can still leave — anything not yet concluded. */
export const OPEN_APPLICATION_STATUSES: TApplicationStatus[] = [
  "pending",
  "reviewed",
  "shortlisted",
  "interviewing",
  "offered",
];
