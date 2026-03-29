import { API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { create } from "zustand";

type TCountCurrentEmployeeMatchingResponse = {
  totalMatching: number;
};
type TCountCurrentEmployeeMatchingState = {
  totalEmpMatching: number | null;
  loading: boolean;
  error: string | null;
  countCurrentEmpMatching: (employeeId: string) => Promise<void>;
};

export const useCountCurrentEmployeeMatchingStore =
  create<TCountCurrentEmployeeMatchingState>((set) => ({
    totalEmpMatching: null,
    loading: false,
    error: null,
    countCurrentEmpMatching: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeId),
        );

        set({
          totalEmpMatching: response.data.totalMatching,
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
