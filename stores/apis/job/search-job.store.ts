import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_SEARCH_JOB_URL } from "@/utils/constants/apis/job.api.constant";
import { TLocations } from "@/utils/types/user/location.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Search Job Query Params ────────────────────────────────────────
type TSearchJobQueryParams = {
  keyword?: string;
  location?: string;
  jobType?: string;
  careerScopes?: string[];
  companySizeMin?: number;
  companySizeMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  educationRequired?: string | string[];
  postedDateFrom?: string;
  postedDateTo?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

// ── Search Job API Response ────────────────────────────────────────
type TSearchJobResponse = {
  id?: string;
  title: string;
  description: string;
  type: string;
  salary: string;
  experience: string;
  education: string;
  skills: string[];
  deadlineDate?: string;
  postedDate: string;
  company: {
    id?: string;
    name: string;
    avatar?: string;
    companySize: number;
    industry: string;
    location: TLocations;
    user: { id: string };
  };
};

// ── Search Job State ────────────────────────────────────────────────
type TSearchJobState = {
  jobs: TSearchJobResponse[] | null;
  error: string | null;
  loading: boolean;
  querySearchJobs: (query: TSearchJobQueryParams) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useSearchJobStore = create<TSearchJobState>((set) => ({
  loading: false,
  error: null,
  message: null,
  jobs: null,
  querySearchJobs: async (query: TSearchJobQueryParams) => {
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

      const queryString = queryParams.toString();
      const url = `${API_SEARCH_JOB_URL}?${queryString}`;

      const response = await axios.get<TSearchJobResponse[]>(url);

      set({
        jobs: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to search jobs"),
        loading: false,
        jobs: null,
      });
    }
  },
}));
