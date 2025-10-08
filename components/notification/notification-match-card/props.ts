import { TUserRole } from "@/utils/types/role.type";

export interface INotificationMatchCardProps {
  timestamp: string;
  role: TUserRole;
  user: {
    id: string;
    name: string;
    position?: string;
    industry?: string;
    avatar: string;
  };
}
