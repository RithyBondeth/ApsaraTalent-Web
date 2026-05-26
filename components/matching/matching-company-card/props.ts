import { IJobPosition } from "@/utils/interfaces/user/company.interface";

export interface IMatchingCompanyCardProps {
  id: string;
  avatar: string;
  name: string;
  industry: string;
  foundedYear: number;
  description: string;
  openPosition: IJobPosition[];
  companySize: number;
  location: string;
  onChatNowClick: () => void;
  onScheduleClick?: () => void;
  isChatLoading?: boolean;
  /** Current employee's ID — used for AI Score */
  employeeId: string;
  /** Current employee's profile fields — used for Cover Letter */
  employeeName: string;
  employeeJob?: string;
  employeeSkills: string[];
  employeeExperience?: string;
  employeeDescription?: string;
  /** Skill overlap score (0–100) from the matching algorithm */
  skillScore?: number | null;
}
