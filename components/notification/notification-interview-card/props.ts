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
    avatar: string;
  };
  onDelete?: (id: string) => void;
  onMarkRead?: (id: string) => void;
}
