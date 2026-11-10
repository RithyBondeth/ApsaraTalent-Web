import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_ACCOUNT_DELETE_CANCEL_URL,
  API_ACCOUNT_DELETE_URL,
  API_ACCOUNT_EXPORT_URL,
} from "@/utils/constants/apis/user-api/user.api.constant";
import { create } from "zustand";

type TRequestDeletionResponse = {
  message: string;
  scheduledFor: string;
};

type TAccountLifecycleState = {
  /** True while a delete/cancel request is in flight. */
  processing: boolean;
  error: string | null;
  requestDeletion: () => Promise<TRequestDeletionResponse | null>;
  cancelDeletion: () => Promise<boolean>;
};

/**
 * The two mutating account-lifecycle actions. Export is a browser download —
 * it uses `withCredentials: true` through a plain anchor tag rather than
 * going through the store, so the file lands in Downloads without a blob
 * URL that expires when the store re-renders.
 */
export const useAccountLifecycleStore = create<TAccountLifecycleState>(
  (set) => ({
    processing: false,
    error: null,

    requestDeletion: async () => {
      set({ processing: true, error: null });
      try {
        const res = await apiClient.post<TRequestDeletionResponse>(
          API_ACCOUNT_DELETE_URL,
        );
        set({ processing: false });
        return res.data;
      } catch (error) {
        set({
          processing: false,
          error: extractApiErrorMessage(
            error,
            "Failed to request account deletion",
          ),
        });
        return null;
      }
    },

    cancelDeletion: async () => {
      set({ processing: true, error: null });
      try {
        await apiClient.post(API_ACCOUNT_DELETE_CANCEL_URL);
        set({ processing: false });
        return true;
      } catch (error) {
        set({
          processing: false,
          error: extractApiErrorMessage(
            error,
            "Failed to cancel account deletion",
          ),
        });
        return false;
      }
    },
  }),
);
