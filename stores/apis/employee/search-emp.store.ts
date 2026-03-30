import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_SEARCH_EMP_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { TAvailability } from "@/utils/types/user/availability.type";
import { TLocations } from "@/utils/types/user/location.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Search Employee Query Params ──────────────────────────────────────
type TSearchEmpQueryParams = {
  keyword?: string;
  location?: TLocations;
  careerScopes?: string[];
  jobType?: TAvailability;
  experienceLevel?: string;
  education?: string | string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

// ── Search Employee API Response ──────────────────────────────────────
type TSearchEmployeeResponse = IEmployee[];

// ── Search Employee State ──────────────────────────────────────────────
type TSearchEmployeeState = {
  employees: TSearchEmployeeResponse | null;
  error: string | null;
  loading: boolean;
  querySearchEmployee: (query: TSearchEmpQueryParams) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useSearchEmployeeStore = create<TSearchEmployeeState>((set) => ({
  employees: null,
  loading: false,
  error: null,
  querySearchEmployee: async (query: TSearchEmpQueryParams) => {
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
      const url = `${API_SEARCH_EMP_URL}?${queryString}`;

      const response = await axios.get<TSearchEmployeeResponse>(url);

      set({
        employees: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: extractApiErrorMessage(error, "Failed to search employee"),
        loading: false,
        employees: null,
      });
    }
  },
}));
