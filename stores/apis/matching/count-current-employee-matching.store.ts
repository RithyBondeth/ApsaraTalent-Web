import { API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Employee Matching API Response ─────────────────
type TCountCurrentEmployeeMatchingResponse = {
  count: number;
};

// ── Count Current Employee Matching State ────────────────────────
type TCountCurrentEmployeeMatchingState = {
  totalEmpMatching: number | null;
  loading: boolean;
  error: string | null;
  countCurrentEmpMatching: (employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentEmployeeMatchingStore =
  create<TCountCurrentEmployeeMatchingState>((set) => ({
    totalEmpMatching: null,
    loading: false,
    error: null,
    countCurrentEmpMatching: async (employeeID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeID),
        );

        set({
          totalEmpMatching: response.data.count,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count current employee matching",
          ),
          loading: false,
          totalEmpMatching: null,
        });
      }
    },
  }));
