import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_CREATE_INTERVIEW_URL,
  API_GET_INTERVIEWS_BY_COMPANY_URL,
  API_GET_INTERVIEWS_BY_EMPLOYEE_URL,
  API_UPDATE_INTERVIEW_STATUS_URL,
} from "@/utils/constants/apis/matching.api.constant";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import {
  ICreateInterviewPayload,
  IInterview,
} from "@/utils/interfaces/interview/interview.interface";
import { TInterviewStatus } from "@/utils/types/interview";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Interview State ───────────────────────────────────────────────────
type InterviewStoreState = {
  interviews: IInterview[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  updatingId: string | null;
  queryInterviews: (id: string, role: string) => Promise<void>;
  /** Fetch interviews in the background without touching `loading` (no skeleton flash). */
  silentRefetch: (id: string, role: string) => Promise<void>;
  /** Optimistically remove all interviews with a given employee or company. Called after unmatch. */
  removeInterviewsByPartnerId: (partnerId: string) => void;
  createInterview: (data: ICreateInterviewPayload) => Promise<void>;
  updateStatus: (
    interviewID: string,
    status: TInterviewStatus,
  ) => Promise<boolean>;
};

/* ---------------------------------- Store --------------------------------- */
export const useInterviewStore = create<InterviewStoreState>((set) => ({
  interviews: [],
  loading: false,
  error: null,
  creating: false,
  updatingId: null,

  queryInterviews: async (id: string, role: string) => {
    set({ loading: true, error: null });

    try {
      const url =
        role === USER_ROLE.EMPLOYEE
          ? API_GET_INTERVIEWS_BY_EMPLOYEE_URL(id)
          : API_GET_INTERVIEWS_BY_COMPANY_URL(id);

      const response = await axios.get<IInterview[]>(url);

      set({
        interviews: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to fetch interviews"),
        loading: false,
        interviews: [],
      });
    }
  },

  silentRefetch: async (id: string, role: string) => {
    try {
      const url =
        role === USER_ROLE.EMPLOYEE
          ? API_GET_INTERVIEWS_BY_EMPLOYEE_URL(id)
          : API_GET_INTERVIEWS_BY_COMPANY_URL(id);

      const response = await axios.get<IInterview[]>(url);
      set({ interviews: response.data });
    } catch {}
  },

  removeInterviewsByPartnerId: (partnerId: string) => {
    set((state) => ({
      interviews: state.interviews.filter(
        (i) => i.employee.id !== partnerId && i.company.id !== partnerId,
      ),
    }));
  },

  createInterview: async (data: ICreateInterviewPayload) => {
    set({ creating: true, error: null });

    try {
      const response = await axios.post<IInterview>(
        API_CREATE_INTERVIEW_URL,
        data,
      );

      set((state) => ({
        interviews: [...state.interviews, response.data],
        creating: false,
        error: null,
      }));
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to create interview"),
        creating: false,
      });
    }
  },

  updateStatus: async (interviewID: string, status: TInterviewStatus) => {
    set({ updatingId: interviewID, error: null });

    try {
      const response = await axios.patch<IInterview>(
        API_UPDATE_INTERVIEW_STATUS_URL,
        { interviewId: interviewID, status },
      );

      set((state) => ({
        interviews: state.interviews.map((i) =>
          i.id === interviewID ? { ...i, status: response.data.status } : i,
        ),
        updatingId: null,
        error: null,
      }));

      return true;
    } catch (error) {
      set({
        error: extractApiErrorMessage(
          error,
          "Failed to update interview status",
        ),
        updatingId: null,
      });

      return false;
    }
  },
}));
