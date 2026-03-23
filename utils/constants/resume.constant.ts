import { TLoadingStep } from "@/components/utils/dialogs/loading-dialog";

export const LIVE_RESUME_PREVIEW_DEBOUNCE_MS = 600;

export const DOWNLOAD_RESUME_STEPS: TLoadingStep[] = [
  { label: "Preparing your resume data", completeAt: 20 },
  { label: "Sending to AI engine", completeAt: 40 },
  { label: "Generating HTML layout", completeAt: 60 },
  { label: "Applying template styling", completeAt: 78 },
  { label: "Rendering PDF", completeAt: 92 },
  { label: "Finalising & compressing", completeAt: 99 },
];
