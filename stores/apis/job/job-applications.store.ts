import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_GET_JOB_APPLICATIONS_URL,
  API_UPDATE_APPLICATION_STATUS_URL,
} from "@/utils/constants/apis/job.api.constant";
import {
  IApplication,
  IUpdateApplicationStatusPayload,
} from "@/utils/interfaces/application/application.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Job Applications State ─────────────────────────────────────────────
type TJobApplicationsState = {
  applicants: IApplication[];
  /** The job the loaded applicants belong to, so a stale list is never shown. */
  jobId: string | null;
  loading: boolean;
  error: string | null;
  updatingId: string | null;
  queryJobApplications: (jobId: string, companyId: string) => Promise<void>;
  updateStatus: (payload: IUpdateApplicationStatusPayload) => Promise<boolean>;
  reset: () => void;
};

/* ---------------------------------- Store ---------------------------------- */
export const useJobApplicationsStore = create<TJobApplicationsState>((set) => ({
  applicants: [],
  jobId: null,
  loading: false,
  error: null,
  updatingId: null,

  reset: () =>
    set({
      applicants: [],
      jobId: null,
      loading: false,
      error: null,
      updatingId: null,
    }),

  queryJobApplications: async (jobId, companyId) => {
    /*
      Clear the previous job's applicants as the request goes out. Keeping them
      would show one job's candidates under another job's heading for as long
      as the fetch takes, which is worse than an empty list.
    */
    set({ loading: true, error: null, applicants: [], jobId });

    try {
      const response = await axios.get<IApplication[]>(
        API_GET_JOB_APPLICATIONS_URL(jobId, companyId),
      );
      set({ applicants: response.data, loading: false, error: null });
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to load applicants"),
        loading: false,
        applicants: [],
      });
    }
  },

  updateStatus: async (payload) => {
    set({ updatingId: payload.applicationId, error: null });

    try {
      const response = await axios.patch<IApplication>(
        API_UPDATE_APPLICATION_STATUS_URL,
        payload,
      );

      set((state) => ({
        applicants: state.applicants.map((a) =>
          a.id === payload.applicationId
            ? {
                ...a,
                status: response.data.status,
                rejectionReason: response.data.rejectionReason,
                statusChangedAt: response.data.statusChangedAt,
                reviewedAt: response.data.reviewedAt,
              }
            : a,
        ),
        updatingId: null,
        error: null,
      }));

      return true;
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to update status"),
        updatingId: null,
      });
      return false;
    }
  },
}));
