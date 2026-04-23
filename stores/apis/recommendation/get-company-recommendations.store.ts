import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_COMPANY_RECOMMENDATIONS_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
type TGetCompanyRecommendationsState = {
  recommendations: IEmployee[] | null;
  loading: false | boolean;
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
      try {
        const response = await axios.get<IEmployee[]>(
          API_GET_COMPANY_RECOMMENDATIONS_URL(companyId, limit),
        );
        set({ recommendations: response.data, loading: false, error: null });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to get company recommendations",
          ),
          loading: false,
          recommendations: null,
        });
      }
    },
  }));
