import { API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import axios from "axios";
import { create } from "zustand";

type TCountCurrentEmployeeMatchingResponse = {
  totalMatching: number | null;
};
type TCountCurrentEmployeeMatchingState =
  TCountCurrentEmployeeMatchingResponse & {
    loading: boolean;
    error: string | null;
    countCurrentEmployeeMatching: (employeeId: string) => Promise<void>;
  };

export const useCountCurrentEmployeeMatchingStore =
  create<TCountCurrentEmployeeMatchingState>((set) => ({
    totalMatching: null,
    loading: false,
    error: null,
    countCurrentEmployeeMatching: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentEmployeeMatchingResponse>(
          API_COUNT_CURRENT_EMPLOYEE_MATCHING_URL(employeeId)
        );

        set({
          totalMatching: response.data.totalMatching,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data.message,
            loading: false,
            totalMatching: null,
          });
        else
          set({
            error: "Failed to count current employee matching",
            loading: false,
            totalMatching: null,
          });
      }
    },
  }));
