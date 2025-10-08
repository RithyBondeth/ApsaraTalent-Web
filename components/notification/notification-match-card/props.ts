import { TUserRole } from "@/utils/types/role.type";

export interface INotificationMatchCardProps {
  seen: boolean;
  timestamp: string;
  role: TUserRole;
  user: {
    id: string;
    name: string;
    position: string | null;
    industry: string | null;
    avatar: string;
  };
}
