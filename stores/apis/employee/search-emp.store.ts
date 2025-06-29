import { API_SEARCH_EMP_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import { TAvailability } from "@/utils/types/availability.type";
import { TLocations } from "@/utils/types/location.type";
import axios from "axios";
import { create } from "zustand";

export type TSearchEmpQuery = {
  keyword?: string;
  location?: TLocations;
  careerScopes?: string[];
  jobType?: TAvailability;
  experienceMin?: number;
  experienceMax?: number;
  education?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

type TSearchEmployee = IEmployee;

type TSearchEmployeeState = {
  employees: TSearchEmployee[] | null;
  error: string | null;
  loading: boolean;
  querySearchEmployee: (query: TSearchEmpQuery, token: string) => Promise<void>;
};

export const useSearchEmployeeStore = create<TSearchEmployeeState>((set) => ({
  employees: null,
  loading: false,
  message: null,
  error: null,
  querySearchEmployee: async (query: TSearchEmpQuery, token: string) => {
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

      const response = await axios.get(
        `${API_SEARCH_EMP_URL}?${queryParams.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`${API_SEARCH_EMP_URL}?${queryParams.toString()}`);

      console.log("Search Employee Res: ", response.data);

      set({
        employees: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          error: error.response?.data?.message,
          loading: false,
          employees: null,
        });
      else
        set({
          error: "Failed to fetch employees",
          loading: false,
          employees: null,
        });
    }
  },
}));
