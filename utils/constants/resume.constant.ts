import { TLoadingStep } from "@/utils/interfaces/ui";
import { TResumeSectionID } from "../types/resume/resume-section-id.type";

export const LIVE_RESUME_PREVIEW_DEBOUNCE_MS = 600;

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
];
