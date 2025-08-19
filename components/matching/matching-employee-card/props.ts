export interface IMatchingEmployeeCardProps {
  avatar: string;
  name: string;
  username: string;
  description: string;
  position: string;
  experience: number;
  availability: string;
  location: string;
  skills: string[];
  onChatNowClick: () => void; 
}