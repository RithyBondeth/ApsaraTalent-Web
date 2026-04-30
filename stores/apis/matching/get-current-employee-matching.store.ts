import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get Current Employee Matching API Response ────────────────────────
type TGetCurrentEmployeeMatchingResponse = ICompany[];

// ── Get Current Employee Matching State ───────────────────────────────
type TGetCurrentEmployeeMatchingState = {
  currentEmployeeMatching: TGetCurrentEmployeeMatchingResponse | null;
  countCurrentEmployeeMatching: number;
  loading: boolean;
  error: string | null;
  queryCurrentEmployeeMatching: (employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetCurrentEmployeeMatchingStore =
  create<TGetCurrentEmployeeMatchingState>((set) => ({
    currentEmployeeMatching: null,
    countCurrentEmployeeMatching: 0,
    loading: false,
    error: null,
    queryCurrentEmployeeMatching: async (employeeID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentEmployeeMatchingResponse>(
          API_GET_CURRENT_EMPLOYEE_MATCHING_URL(employeeID),
        );

        set({
          currentEmployeeMatching: response.data,
          countCurrentEmployeeMatching: response.data.length,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to get current employee matching",
          ),
          loading: false,
          currentEmployeeMatching: null,
        });
      }
    },
  }));
