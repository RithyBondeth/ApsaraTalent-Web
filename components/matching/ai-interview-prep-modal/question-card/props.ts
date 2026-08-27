import { IAiInterviewPrepQuestion } from "@/utils/interfaces/resume/ai-resume.interface";

export interface IQuestionCardProps {
  item: IAiInterviewPrepQuestion;
  index: number;
  tipLabel: string;
}
