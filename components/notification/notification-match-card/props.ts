import { TUserRole } from "@/utils/types/role.type";

export interface INotificationMatchCardProps {
  time: string;
  role: TUserRole;
  user: {
    id: string;
    name: string;
    position?: string;
    industry?: string;
    avatar: string;
  };
}
