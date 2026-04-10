import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Get Current Company Matching API Response ────────────────────────
type TGetCurrentCompanyMatchingResponse = IEmployee[];

// ── Get Current Company Matching State ───────────────────────────────
type TGetCurrentCompanyMatchingState = {
  currentCompanyMatching: TGetCurrentCompanyMatchingResponse | null;
  countCurrentCompanyMatching: number;
  loading: boolean;
  error: string | null;
  queryCurrentCompanyMatching: (companyID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetCurrentCompanyMatchingStore =
  create<TGetCurrentCompanyMatchingState>((set) => ({
    currentCompanyMatching: null,
    countCurrentCompanyMatching: 0,
    loading: false,
    error: null,
    queryCurrentCompanyMatching: async (companyID: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentCompanyMatchingResponse>(
          API_GET_CURRENT_COMPANY_MATCHING_URL(companyID),
        );

        set({
          currentCompanyMatching: response.data,
          countCurrentCompanyMatching: response.data.length,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to get current company matching",
          ),
          loading: false,
          currentCompanyMatching: null,
        });
      }
    },
  }));
