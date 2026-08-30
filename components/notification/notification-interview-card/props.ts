import { TUserRole } from "@/utils/types/auth/role.type";

export interface INotificationInterviewCardProps {
  id: string;
  seen: boolean;
  timestamp: string;
  role: TUserRole;
  eventType: string;
  senderName: string;
  interviewTitle: string;
  status?: string;
  rawMessage?: string;
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
