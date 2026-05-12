import { TUserRole } from "@/utils/types/auth/role.type";

export interface INotificationLikeCardProps {
  id: string;
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
  message: string;
  onDelete?: (id: string) => void;
}
