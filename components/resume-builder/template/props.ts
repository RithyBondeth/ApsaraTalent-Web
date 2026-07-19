import { TResumeTemplate } from "@/utils/types/resume/resume.type";

export interface ITemplateCardProps {
  templateKey: TResumeTemplate;
  image: string | null;
  title: string;
  description: string;
  onUseTemplate: () => void;
  selected?: boolean;
}
