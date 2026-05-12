import { TUserRole } from "@/utils/types/auth/role.type";

export interface INotificationInterviewCardProps {
  id: string;
  seen: boolean;
  timestamp: string;
  role: TUserRole;
  title: string;
  message: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  onDelete?: (id: string) => void;
}
