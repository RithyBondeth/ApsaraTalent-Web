import { INotificationMatchCardProps } from "../notification-match-card/props";

export interface INotificationMessageCardProps extends INotificationMatchCardProps {
  /** Short preview of the message content (e.g. "Photo", "Audio message", or text) */
  preview: string;
}
