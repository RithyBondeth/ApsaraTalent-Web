/* ---------------------------------- Brand --------------------------------- */
export const BRAND_NAME = "Apsara Talent";

/* ------------------------------ Storage Keys ------------------------------ */
export const ONBOARDING_STORAGE_KEY = "onboarding-complete-v1";

/* --------------------------------- Files ---------------------------------- */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const DOCUMENT_SIZE = 5 * 1024 * 1024;

export const ACCEPTED_FILE_TYPES: string[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/* -------------------------------- Timeouts -------------------------------- */
export const RESUME_GENERATION_TIMEOUT_MS = 180000;
export const DEFAULT_REDIRECT_DELAY_MS = 1000;
export const LIKE_DEBOUNCE_MS = 200;
export const COPY_FEEDBACK_TIMEOUT_MS = 2000;
export const MODAL_ANIMATION_DELAY_MS = 400;
export const ONBOARDING_SHOW_DELAY_MS = 1200;
export const RESUME_DOWNLOAD_SETTLE_MS = 500;

/* ------------------------------ Retry Config ------------------------------ */
export const RECOMMENDATION_MAX_RETRIES = 2;
export const RECOMMENDATION_RETRY_DELAY_MS = 1500;

/* --------------------------------- Toasts --------------------------------- */
export const TOAST_DURATION_MS = {
  SHORT: 1000,
  MEDIUM: 1500,
} as const;

/* ------------------------------- Pagination ------------------------------- */
export const FEED_PAGE_SIZE = 9;
export const NOTIFICATION_PAGE_SIZE = 20;
