import { TResumeTemplate } from "@/utils/types/resume/resume.type";

export interface IResumeBuilderGenerateProps {
  onGenerateClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Currently selected template key — drives the accent swatch */
  selectedTemplate?: TResumeTemplate | null;
  /** Translated label of the selected template */
  selectedTemplateLabel?: string | null;
}
