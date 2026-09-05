/**
 * Every analytics event the browser emits.
 *
 * A closed enum on purpose. Every string here is a column in a PostHog
 * dashboard three months from now; a typo silently forks the funnel and
 * the mistake is invisible until someone squints at the chart. Server-side
 * events use their own enum in the API — the strings match by convention
 * so client + server events stitch into one funnel.
 */
export enum EWebAnalyticsEvent {
  /* ---------- Navigation & views ---------- */
  PAGE_VIEW = "page_view",
  PUBLIC_JOB_VIEWED = "public_job_viewed",
  JOB_SEARCHED = "job_searched",

  /* ---------- Applications ---------- */
  APPLY_DIALOG_OPENED = "apply_dialog_opened",

  /* ---------- Matching ---------- */
  MATCHING_CARD_LIKED = "matching_card_liked",
  MATCHING_CARD_PASSED = "matching_card_passed",

  /* ---------- Account ---------- */
  ACCOUNT_DELETE_DIALOG_OPENED = "account_delete_dialog_opened",
  ACCOUNT_EXPORT_CLICKED = "account_export_clicked",
}
