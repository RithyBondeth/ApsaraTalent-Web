import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_GET_NOTIFICATIONS_URL,
  API_GET_UNREAD_NOTIFICATION_COUNT_URL,
  API_MARK_ALL_NOTIFICATIONS_READ_URL,
  API_MARK_NOTIFICATION_READ_URL,
} from "@/utils/constants/apis/notification_url";
import { create } from "zustand";

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

interface NotificationListResponse {
  items: INotification[];
  total: number;
  page: number;
  limit: number;
}

type TNotificationState = {
  loading: boolean;
  error: string | null;
  notifications: INotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;

  // Actions
  fetchNotifications: (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  /** Instantly bump unreadCount by 1 (used when a foreground push arrives) */
  incrementUnreadCount: () => void;
  markRead: (notificationId: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  /** Optimistically mark a notification as read by its chat messageId (from data.messageId) */
  markReadByChatMessageId: (messageId: string) => void;
};

export const useNotificationStore = create<TNotificationState>((set, get) => ({
  loading: false,
  error: null,
  notifications: [],
  total: 0,
  page: 1,
  limit: 20,
  unreadCount: 0,

  fetchNotifications: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 20, unreadOnly = false } = params;
      const response = await axios.get<NotificationListResponse>(
        API_GET_NOTIFICATIONS_URL,
        { params: { page, limit, unreadOnly } },
      );
      set({
        notifications: response.data.items,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        loading: false,
        error: extractApiErrorMessage(error, "Failed to fetch notifications"),
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await axios.get<{ unreadCount: number }>(
        API_GET_UNREAD_NOTIFICATION_COUNT_URL,
      );
      set({ unreadCount: response.data.unreadCount });
    } catch {
      // Silently fail — unread count is non-critical
    }
  },

  incrementUnreadCount: () => {
    set((state) => ({ unreadCount: state.unreadCount + 1 }));
  },

  markRead: async (notificationId: string) => {
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    try {
      await axios.patch(API_MARK_NOTIFICATION_READ_URL(notificationId));
    } catch {
      // Revert on failure
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: false } : n,
        ),
        unreadCount: state.unreadCount + 1,
      }));
    }
  },

  markAllRead: async () => {
    const prevNotifications = get().notifications;
    const prevUnreadCount = get().unreadCount;
    // Optimistic update
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
    try {
      await axios.patch(API_MARK_ALL_NOTIFICATIONS_READ_URL);
    } catch {
      // Revert on failure
      set({
        notifications: prevNotifications,
        unreadCount: prevUnreadCount,
      });
    }
  },

  markReadByChatMessageId: (messageId: string) => {
    const { notifications, markRead } = get();
    const match = notifications.find(
      (n) => n.type === "chat" && n.data?.messageId === messageId && !n.isRead,
    );
    if (match) {
      void markRead(match.id);
    }
  },
}));
