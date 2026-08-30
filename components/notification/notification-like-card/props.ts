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
    /**
     * Absent when the sender has no picture. Leave it undefined rather than
     * pointing at a placeholder file: AvatarImage then stays unloaded and
     * AvatarFallback shows the initials.
     */
    avatar?: string;
  };
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}
