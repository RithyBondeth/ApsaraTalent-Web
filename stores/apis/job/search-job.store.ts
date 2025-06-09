import {
  API_JOB_BASE_URL,
  API_SEARCH_JOB_URL,
} from "@/utils/constants/apis/job_url";
import { IJobPosition } from "@/utils/interfaces/user-interface/company.interface";
import axios from "axios";
import { create } from "zustand";

export type TSearchJobQuery = {
  keyword?: string;
  location?: string;
  careerScopes?: string[];
  companySizeMin?: number;
  companySizeMax?: number;
  postedDateFrom?: string;
  postedDateTo?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

type TSearchJobResponse = {
  jobs: IJobPosition[] | null;
};

type TSearchJobState = TSearchJobResponse & {
  error: string | null;
  loading: boolean;
  querySearchJobs: (query: TSearchJobQuery, token: string) => Promise<void>;
};

export const useSearchJobStore = create<TSearchJobState>((set) => ({
  loading: false,
  error: null,
  message: null,
  jobs: null,
  querySearchJobs: async (query: TSearchJobQuery, token: string) => {
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const response = await axios.get<TSearchJobResponse>(
        `${API_SEARCH_JOB_URL}?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({
        jobs: response.data.jobs,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          error: error.response?.data?.message,
          loading: false,
          jobs: null,
        });
      else
        set({
          error: "Failed to fetch jobs",
          loading: false,
          jobs: null,
        });
    }
  },
}));
