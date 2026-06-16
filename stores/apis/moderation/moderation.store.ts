import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_BLOCK_STATUS_URL,
  API_BLOCK_USER_URL,
  API_HIDDEN_PROFILE_IDS_URL,
  API_LIST_BLOCKED_URL,
  API_REPORT_USER_URL,
  API_UNBLOCK_USER_URL,
} from "@/utils/constants/apis/moderation.api.constant";
import {
  TBlockStatus,
  TBlockedUser,
} from "@/utils/types/moderation/block.type";
import { TReportUserPayload } from "@/utils/types/moderation/report.type";
import { create } from "zustand";

/* ---------------------------------- Types --------------------------------- */
type TModerationState = {
  // Block status keyed by the target id passed in (user/employee/company id).
  // Keyed so different profiles/chats never read each other's stale status.
  statusByTarget: Record<string, TBlockStatus>;
  loadingStatus: boolean;
  blocking: boolean;
  reporting: boolean;
  error: string | null;
  blockedUsers: TBlockedUser[];
  loadingBlocked: boolean;
  blockedLoaded: boolean;
  // Employee/company profile ids hidden in BOTH directions (people I blocked +
  // people who blocked me) — used to filter the feed client-side.
  hiddenProfileIds: string[];
  hiddenLoaded: boolean;
  getBlockStatus: (targetId: string) => Promise<void>;
  getBlockedUsers: () => Promise<void>;
  getHiddenProfileIds: () => Promise<void>;
  blockUser: (targetId: string) => Promise<boolean>;
  unblockUser: (targetId: string) => Promise<boolean>;
  reportUser: (payload: TReportUserPayload) => Promise<boolean>;
};

/* ---------------------------------- Store --------------------------------- */
export const useModerationStore = create<TModerationState>((set) => ({
  statusByTarget: {},
  loadingStatus: false,
  blocking: false,
  reporting: false,
  error: null,
  blockedUsers: [],
  loadingBlocked: false,
  blockedLoaded: false,
  hiddenProfileIds: [],
  hiddenLoaded: false,

  getHiddenProfileIds: async () => {
    try {
      const res = await apiClient.get<string[]>(API_HIDDEN_PROFILE_IDS_URL);
      set({ hiddenProfileIds: res.data ?? [], hiddenLoaded: true });
    } catch {
      // Non-fatal: feed simply won't hide blocked users this load.
      set({ hiddenLoaded: true });
    }
  },

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

  getBlockStatus: async (targetId) => {
    set({ loadingStatus: true });
    try {
      const res = await apiClient.get<TBlockStatus>(
        API_BLOCK_STATUS_URL(targetId),
      );
      set((s) => ({
        statusByTarget: { ...s.statusByTarget, [targetId]: res.data },
        loadingStatus: false,
        error: null,
      }));
    } catch (error) {
      set({
        loadingStatus: false,
        error: extractApiErrorMessage(error, "Failed to load block status"),
      });
    }
  },

  blockUser: async (targetId) => {
    set({ blocking: true });
    try {
      await apiClient.post(API_BLOCK_USER_URL(targetId));
      set((s) => ({
        blocking: false,
        error: null,
        statusByTarget: {
          ...s.statusByTarget,
          [targetId]: {
            isBlocked: true,
            blockedByMe: true,
            blockedMe: s.statusByTarget[targetId]?.blockedMe ?? false,
          },
        },
        // Invalidate the cached lists so feeds refetch and hide the
        // newly-blocked user on next mount.
        blockedLoaded: false,
        hiddenLoaded: false,
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

  unblockUser: async (targetId) => {
    set({ blocking: true });
    try {
      await apiClient.delete(API_UNBLOCK_USER_URL(targetId));
      set((s) => {
        const prevBlockedMe = s.statusByTarget[targetId]?.blockedMe ?? false;
        return {
          blocking: false,
          error: null,
          statusByTarget: {
            ...s.statusByTarget,
            [targetId]: {
              blockedByMe: false,
              blockedMe: prevBlockedMe,
              isBlocked: prevBlockedMe,
            },
          },
          // The id may be a user/employee/company id — match any of them so the
          // settings list stays in sync regardless of where unblock was called.
          blockedUsers: s.blockedUsers.filter(
            (u) =>
              u.id !== targetId &&
              u.employeeId !== targetId &&
              u.companyId !== targetId,
          ),
          // Force the feed to refetch its hidden-id set so the unblocked user
          // can reappear.
          hiddenLoaded: false,
        };
      });
      return true;
    } catch (error) {
      set({
        blocking: false,
        error: extractApiErrorMessage(error, "Failed to unblock user"),
      });
      return false;
    }
  },

  reportUser: async (payload: TReportUserPayload) => {
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
