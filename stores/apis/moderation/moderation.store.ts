import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_BLOCK_STATUS_URL,
  API_BLOCK_USER_URL,
  API_LIST_BLOCKED_URL,
  API_REPORT_USER_URL,
  API_UNBLOCK_USER_URL,
} from "@/utils/constants/apis/moderation.api.constant";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
export type TReportReason =
  | "spam"
  | "harassment"
  | "inappropriate_content"
  | "fake_profile"
  | "scam"
  | "other";

export type TBlockStatus = {
  isBlocked: boolean;
  blockedByMe: boolean;
  blockedMe: boolean;
};

export type TBlockedUser = {
  id: string;
  employeeId: string | null;
  companyId: string | null;
  name: string;
  avatar: string | null;
  role: "employee" | "company" | "admin" | "none";
  blockedAt: string;
};

type TReportPayload = {
  reportedId: string;
  reason: TReportReason;
  details?: string;
};

type TModerationState = {
  status: TBlockStatus | null;
  loadingStatus: boolean;
  blocking: boolean;
  reporting: boolean;
  error: string | null;
  blockedUsers: TBlockedUser[];
  loadingBlocked: boolean;
  blockedLoaded: boolean;
  getBlockStatus: (userId: string) => Promise<void>;
  getBlockedUsers: () => Promise<void>;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  reportUser: (payload: TReportPayload) => Promise<boolean>;
  resetStatus: () => void;
};

/* ---------------------------------- Store --------------------------------- */
export const useModerationStore = create<TModerationState>((set) => ({
  status: null,
  loadingStatus: false,
  blocking: false,
  reporting: false,
  error: null,
  blockedUsers: [],
  loadingBlocked: false,
  blockedLoaded: false,

  resetStatus: () => set({ status: null, error: null }),

  getBlockedUsers: async () => {
    set({ loadingBlocked: true });
    try {
      const res = await apiClient.get<TBlockedUser[]>(API_LIST_BLOCKED_URL);
      set({
        blockedUsers: res.data,
        loadingBlocked: false,
        blockedLoaded: true,
        error: null,
      });
    } catch (error) {
      set({
        loadingBlocked: false,
        blockedLoaded: true,
        error: extractApiErrorMessage(error, "Failed to load blocked users"),
      });
    }
  },

  getBlockStatus: async (userId) => {
    set({ loadingStatus: true });
    try {
      const res = await apiClient.get<TBlockStatus>(
        API_BLOCK_STATUS_URL(userId),
      );
      set({ status: res.data, loadingStatus: false, error: null });
    } catch (error) {
      set({
        loadingStatus: false,
        error: extractApiErrorMessage(error, "Failed to load block status"),
      });
    }
  },

  blockUser: async (userId) => {
    set({ blocking: true });
    try {
      await apiClient.post(API_BLOCK_USER_URL(userId));
      set((s) => ({
        blocking: false,
        error: null,
        status: {
          isBlocked: true,
          blockedByMe: true,
          blockedMe: s.status?.blockedMe ?? false,
        },
        // Invalidate the cached blocked list so feeds refetch and hide the
        // newly-blocked user on next mount.
        blockedLoaded: false,
      }));
      return true;
    } catch (error) {
      set({
        blocking: false,
        error: extractApiErrorMessage(error, "Failed to block user"),
      });
      return false;
    }
  },

  unblockUser: async (userId) => {
    set({ blocking: true });
    try {
      await apiClient.delete(API_UNBLOCK_USER_URL(userId));
      set((s) => ({
        blocking: false,
        error: null,
        status: {
          blockedByMe: false,
          blockedMe: s.status?.blockedMe ?? false,
          isBlocked: s.status?.blockedMe ?? false,
        },
        blockedUsers: s.blockedUsers.filter((u) => u.id !== userId),
      }));
      return true;
    } catch (error) {
      set({
        blocking: false,
        error: extractApiErrorMessage(error, "Failed to unblock user"),
      });
      return false;
    }
  },

  reportUser: async (payload) => {
    set({ reporting: true });
    try {
      await apiClient.post(API_REPORT_USER_URL, payload);
      set({ reporting: false, error: null });
      return true;
    } catch (error) {
      set({
        reporting: false,
        error: extractApiErrorMessage(error, "Failed to submit report"),
      });
      return false;
    }
  },
}));
