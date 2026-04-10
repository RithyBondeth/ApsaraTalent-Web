import { API_COUNT_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Count Current Company Matching API Response ─────────────────
type TCountCurrentCompanyMatchingResponse = {
  totalMatching: number;
};

// ── Count Current Company Matching State ────────────────────────
type TCountCurrentCompanyMatchingState = {
  totalCmpMatching: number | null;
  loading: boolean;
  error: string | null;
  countCurrentCmpMatching: (companyID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCountCurrentCompanyMatchingStore =
  create<TCountCurrentCompanyMatchingState>((set) => ({
    totalCmpMatching: null,
    loading: false,
    error: null,
    countCurrentCmpMatching: async (companyID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyMatchingResponse>(
          API_COUNT_CURRENT_COMPANY_MATCHING_URL(companyID),
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
