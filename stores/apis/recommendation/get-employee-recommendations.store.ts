import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_EMPLOYEE_RECOMMENDATIONS_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { create } from "zustand";
import {
  RECOMMENDATION_MAX_RETRIES,
  RECOMMENDATION_RETRY_DELAY_MS,
} from "@/utils/constants/config.constant";

const MAX_RETRIES = RECOMMENDATION_MAX_RETRIES;
const RETRY_DELAY_MS = RECOMMENDATION_RETRY_DELAY_MS;

/* ---------------------------------- States --------------------------------- */
type TGetEmployeeRecommendationsState = {
  recommendations: ICompany[] | null;
  loading: boolean;
  error: string | null;
  queryEmployeeRecommendations: (
    employeeId: string,
    limit?: number,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useGetEmployeeRecommendationsStore =
  create<TGetEmployeeRecommendationsState>((set) => ({
    recommendations: null,
    loading: false,
    error: null,
    queryEmployeeRecommendations: async (employeeId, limit) => {
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
          const response = await axios.get<ICompany[]>(
            API_GET_EMPLOYEE_RECOMMENDATIONS_URL(employeeId, limit),
          );
          set({ recommendations: response.data, loading: false, error: null });
          return;
        } catch (error) {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;

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
          "Failed to get employee recommendations",
        ),
        loading: false,
        recommendations: null,
      });
    },
  }));
