export interface IMatchingEmployeeCardProps {
  id: string;
  avatar: string;
  name: string;
  username: string;
  description: string;
  position: string;
  experience: string;
  availability: string;
  location: string;
  skills: string[];
  onChatNowClick: () => void;
  onScheduleClick?: () => void;
  onUnmatch: () => void;
  isChatLoading?: boolean;
  isUnmatching?: boolean;
  /** Viewing company's ID — used for AI Score */
  companyId: string;
  /** Skill overlap score (0–100) from the matching algorithm */
  skillScore?: number | null;
  /** Overall weighted fit (0–100): skills, experience, type, mode, languages, location */
  matchScore?: number | null;
}
