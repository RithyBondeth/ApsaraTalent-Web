export interface INotification {
  id: string;
  title: string;
  message: string;
  type: "chat" | "match" | string | null;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
