import { API_COUNT_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { create } from "zustand";

type TCountCurrentCompanyMatchingResponse = {
  totalMatching: number;
};
type TCountCurrentCompanyMatchingState = {
  totalCmpMatching: number | null;
  loading: boolean;
  error: string | null;
  countCurrentCompanyMatching: (companyId: string) => Promise<void>;
};

export const useCountCurrentCompanyMatchingStore =
  create<TCountCurrentCompanyMatchingState>((set) => ({
    totalCmpMatching: null,
    loading: false,
    error: null,
    countCurrentCompanyMatching: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyId),
        );

        set({
          totalCmpMatching: response.data.totalMatching,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count current company matching",
          ),
          loading: false,
          totalCmpMatching: null,
        });
      }
    },
  }));
