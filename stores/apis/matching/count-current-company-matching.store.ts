import { API_COUNT_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import axios from "axios";
import { create } from "zustand";

type TCountCurrentCompanyMatchingResponse = {
  totalMatching: number | null;
};
type TCountCurrentCompanyMatchingState =
  TCountCurrentCompanyMatchingResponse & {
    loading: boolean;
    error: string | null;
    countCurrentCompanyMatching: (companyId: string) => Promise<void>;
  };

export const useCountCurrentCompanyMatchingStore =
  create<TCountCurrentCompanyMatchingState>((set) => ({
    totalMatching: null,
    loading: false,
    error: null,
    countCurrentCompanyMatching: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyId)
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
            error: "Failed to count current company matching",
            loading: false,
            totalMatching: null,
          });
      }
    },
  }));
