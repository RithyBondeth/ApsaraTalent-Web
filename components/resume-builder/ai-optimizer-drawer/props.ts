import { IBuildResume } from "@/utils/interfaces/resume";

export interface IAiOptimizerDrawerProps {
  getCurrentValues: () => IBuildResume;
  onApplySummary: (summary: string) => void;
  onApplySkills: (skills: string[]) => void;
  onApplyExperience: (
    index: number,
    description: string,
    achievements: string[],
  ) => void;
}
