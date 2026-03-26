export interface IMatchingEmployeeCardProps {
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
}
