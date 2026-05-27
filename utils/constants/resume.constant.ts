import { TLoadingStep } from "@/utils/interfaces/ui/loading.interface";
import { TResumeSectionID } from "../types/resume/resume-section-id.type";

/* --------------------------------- Config --------------------------------- */
export const LIVE_RESUME_PREVIEW_DEBOUNCE_MS = 600;

/* ------------------------------ Editor Layout ----------------------------- */
export const RESUME_EDITOR_A4_WIDTH = 794;
export const RESUME_EDITOR_ZOOM_STEP = 0.1;
export const RESUME_EDITOR_ZOOM_MIN = 0.5;
export const RESUME_EDITOR_ZOOM_MAX = 2.0;

/* ------------------------------ Storage Keys ------------------------------ */
export const RESUME_LOCAL_STORAGE_KEY = "apsara-talent-resume-draft";

/* --------------------------------- Loading -------------------------------- */
export const DOWNLOAD_RESUME_STEPS: TLoadingStep[] = [
  { label: "Preparing your resume data", completeAt: 20 },
  { label: "Sending to AI engine", completeAt: 40 },
  { label: "Generating HTML layout", completeAt: 60 },
  { label: "Applying template styling", completeAt: 78 },
  { label: "Rendering PDF", completeAt: 92 },
  { label: "Finalising & compressing", completeAt: 99 },
] as const;

export const RESUME_EDITOR_DEFAULT_SECTION_ORDER: TResumeSectionID[] = [
  "summary",
  "experience",
  "skills",
  "education",
] as const;
