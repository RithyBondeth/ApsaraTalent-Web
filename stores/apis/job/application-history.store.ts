import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_APPLICATION_HISTORY_URL } from "@/utils/constants/apis/job.api.constant";
import { IApplicationStatusHistoryEntry } from "@/utils/interfaces/application/application.interface";
import { create } from "zustand";

/*
  Read-only sibling of `application-notes.store.ts`. Keyed by application id
  so the drawer can show a trail per candidate without cross-talk between
  rows the recruiter opens back-to-back.
*/

type TApplicationHistoryState = {
  historyByApplication: Record<string, IApplicationStatusHistoryEntry[]>;
  loadingByApplication: Record<string, boolean>;
  error: string | null;
  fetchHistory: (applicationId: string) => Promise<void>;
  reset: (applicationId?: string) => void;
};

export const useApplicationHistoryStore = create<TApplicationHistoryState>(
  (set) => ({
    historyByApplication: {},
    loadingByApplication: {},
    error: null,

    reset: (applicationId) => {
      if (!applicationId) {
        set({
          historyByApplication: {},
          loadingByApplication: {},
          error: null,
        });
        return;
      }
      set((state) => {
        const history = { ...state.historyByApplication };
        delete history[applicationId];
        const loading = { ...state.loadingByApplication };
        delete loading[applicationId];
        return {
          historyByApplication: history,
          loadingByApplication: loading,
        };
      });
    },

    fetchHistory: async (applicationId) => {
      set((state) => ({
        loadingByApplication: {
          ...state.loadingByApplication,
          [applicationId]: true,
        },
        error: null,
      }));

      try {
        const response = await axios.get<IApplicationStatusHistoryEntry[]>(
          API_APPLICATION_HISTORY_URL(applicationId),
        );
        set((state) => ({
          historyByApplication: {
            ...state.historyByApplication,
            [applicationId]: response.data,
          },
          loadingByApplication: {
            ...state.loadingByApplication,
            [applicationId]: false,
          },
        }));
      } catch (error) {
        set((state) => ({
          error: extractApiErrorMessage(error, "Failed to load history"),
          loadingByApplication: {
            ...state.loadingByApplication,
            [applicationId]: false,
          },
        }));
      }
    },
  }),
);
