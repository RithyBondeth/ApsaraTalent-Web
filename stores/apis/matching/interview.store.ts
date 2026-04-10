import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_CREATE_INTERVIEW_URL,
  API_GET_INTERVIEWS_BY_COMPANY_URL,
  API_GET_INTERVIEWS_BY_EMPLOYEE_URL,
  API_UPDATE_INTERVIEW_STATUS_URL,
} from "@/utils/constants/apis/matching.api.constant";
import {
  ICreateInterviewPayload,
  IInterview,
} from "@/utils/interfaces/interview/interview.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Interview State ───────────────────────────────────────────────────
type InterviewStoreState = {
  interviews: IInterview[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  queryInterviews: (id: string, role: string) => Promise<void>;
  createInterview: (data: ICreateInterviewPayload) => Promise<void>;
  updateStatus: (interviewID: string, status: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useInterviewStore = create<InterviewStoreState>((set) => ({
  interviews: [],
  loading: false,
  error: null,
  creating: false,

  queryInterviews: async (id: string, role: string) => {
    set({ loading: true, error: null });

    try {
      const url =
        role === "employee"
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

  updateStatus: async (interviewID: string, status: string) => {
    set({ error: null });

    try {
      const response = await axios.patch<IInterview>(
        API_UPDATE_INTERVIEW_STATUS_URL,
        { interviewID, status },
      );

      set((state) => ({
        interviews: state.interviews.map((i) =>
          i.id === interviewID ? { ...i, status: response.data.status } : i,
        ),
        error: null,
      }));
    } catch (error) {
      set({
        error: extractApiErrorMessage(
          error,
          "Failed to update interview status",
        ),
      });
    }
  },
}));
