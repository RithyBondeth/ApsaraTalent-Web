import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_APPLY_JOB_URL,
  API_GET_MY_APPLICATIONS_URL,
  API_WITHDRAW_APPLICATION_URL,
} from "@/utils/constants/apis/job.api.constant";
import {
  IApplication,
  IApplyPayload,
} from "@/utils/interfaces/application/application.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── My Applications State ──────────────────────────────────────────────
type TMyApplicationsState = {
  applications: IApplication[];
  loading: boolean;
  error: string | null;
  applying: boolean;
  withdrawingId: string | null;
  queryMyApplications: () => Promise<void>;
  /** Resolves to the created application, or null when the request failed. */
  applyToJob: (payload: IApplyPayload) => Promise<IApplication | null>;
  withdrawApplication: (applicationId: string) => Promise<boolean>;
  clearError: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useMyApplicationsStore = create<TMyApplicationsState>((set) => ({
  applications: [],
  loading: false,
  error: null,
  applying: false,
  withdrawingId: null,

  clearError: () => set({ error: null }),

  queryMyApplications: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IApplication[]>(
        API_GET_MY_APPLICATIONS_URL,
      );
      set({ applications: response.data, loading: false, error: null });
    } catch (error) {
      set({
        error: extractApiErrorMessage(
          error,
          "Failed to load your applications",
        ),
        loading: false,
        applications: [],
      });
    }
  },

  applyToJob: async (payload) => {
    set({ applying: true, error: null });

    try {
      const response = await axios.post<IApplication>(
        API_APPLY_JOB_URL,
        payload,
      );

      /*
        Re-applying after a withdrawal revives the existing row rather than
        creating a second one, so match on id before appending — otherwise the
        same application would appear twice in the list.
      */
      set((state) => ({
        applications: state.applications.some((a) => a.id === response.data.id)
          ? state.applications.map((a) =>
              a.id === response.data.id ? response.data : a,
            )
          : [response.data, ...state.applications],
        applying: false,
        error: null,
      }));

      return response.data;
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to submit application"),
        applying: false,
      });
      return null;
    }
  },

  withdrawApplication: async (applicationId) => {
    set({ withdrawingId: applicationId, error: null });

    try {
      await axios.delete(API_WITHDRAW_APPLICATION_URL(applicationId));

      /*
        The row is not deleted server-side any more — it becomes `withdrawn` —
        so the candidate keeps seeing it in their history instead of it
        vanishing.
      */
      set((state) => ({
        applications: state.applications.map((a) =>
          a.id === applicationId
            ? {
                ...a,
                status: "withdrawn" as const,
                statusChangedAt: new Date().toISOString(),
              }
            : a,
        ),
        withdrawingId: null,
        error: null,
      }));

      return true;
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to withdraw application"),
        withdrawingId: null,
      });
      return false;
    }
  },
}));
