import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_COMPANY_RECOMMENDATIONS_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/* ---------------------------------- States --------------------------------- */
type TGetCompanyRecommendationsState = {
  recommendations: IEmployee[] | null;
  loading: boolean;
  error: string | null;
  queryCompanyRecommendations: (
    companyId: string,
    limit?: number,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetCompanyRecommendationsStore =
  create<TGetCompanyRecommendationsState>((set) => ({
    recommendations: null,
    loading: false,
    error: null,
    queryCompanyRecommendations: async (companyId, limit) => {
      set({ loading: true, error: null });

      let lastError: unknown;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        // Wait before each retry (not before the first attempt)
        if (attempt > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY_MS * attempt),
          );
        }

        try {
          const response = await axios.get<IEmployee[]>(
            API_GET_COMPANY_RECOMMENDATIONS_URL(companyId, limit),
          );
          set({ recommendations: response.data, loading: false, error: null });
          return;
        } catch (error) {
          const status = (error as { response?: { status?: number } })
            ?.response?.status;

          // 404 = no recommendations found — treat as empty, not an error.
          // Never retry on 404 — no point, the result won't change.
          if (status === 404) {
            set({ recommendations: [], loading: false, error: null });
            return;
          }

          lastError = error;
          // For server errors (5xx) or network failures, keep retrying.
          // Client errors (4xx except 404) are not retried.
          if (status && status >= 400 && status < 500) break;
        }
      }

      // All attempts exhausted
      set({
        error: extractApiErrorMessage(
          lastError,
          "Failed to get company recommendations",
        ),
        loading: false,
        recommendations: null,
      });
    },
  }));
