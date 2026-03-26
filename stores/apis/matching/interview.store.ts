import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import {
  API_CREATE_INTERVIEW_URL,
  API_GET_INTERVIEWS_BY_COMPANY_URL,
  API_GET_INTERVIEWS_BY_EMPLOYEE_URL,
  API_UPDATE_INTERVIEW_STATUS_URL,
} from "@/utils/constants/apis/matching_url";
import { create } from "zustand";

export interface IInterview {
  id: string;
  employee: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    avatar?: string;
  };
  company: {
    id: string;
    name: string;
    avatar?: string;
  };
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  location?: string;
  meetingLink?: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

interface CreateInterviewPayload {
  employeeId: string;
  companyId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes?: number;
  location?: string;
  meetingLink?: string;
  createdBy: string;
}

type InterviewStoreState = {
  interviews: IInterview[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  fetchInterviews: (id: string, role: string) => Promise<void>;
  createInterview: (data: CreateInterviewPayload) => Promise<void>;
  updateStatus: (interviewId: string, status: string) => Promise<void>;
};

export const useInterviewStore = create<InterviewStoreState>((set, get) => ({
  interviews: [],
  loading: false,
  error: null,
  creating: false,

  fetchInterviews: async (id: string, role: string) => {
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

  createInterview: async (data: CreateInterviewPayload) => {
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

  updateStatus: async (interviewId: string, status: string) => {
    set({ error: null });

    try {
      const response = await axios.patch<IInterview>(
        API_UPDATE_INTERVIEW_STATUS_URL,
        { interviewId, status },
      );

      set((state) => ({
        interviews: state.interviews.map((i) =>
          i.id === interviewId ? { ...i, status: response.data.status } : i,
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
