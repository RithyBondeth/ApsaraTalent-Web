import { ReactNode } from "react";

export interface INotificationBaseCardProps {
  id: string;
  seen: boolean;
  timestamp: string | Date;
  title: string;
  description: ReactNode;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  unreadColor?: string;
  children?: ReactNode;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  className?: string;
}
