import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_GET_EMPLOYEE_RECOMMENDATIONS_URL } from "@/utils/constants/apis/user-api/user.api.constant";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { create } from "zustand";

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
      try {
        const response = await axios.get<ICompany[]>(
          API_GET_EMPLOYEE_RECOMMENDATIONS_URL(employeeId, limit),
        );
        set({ recommendations: response.data, loading: false, error: null });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to get employee recommendations",
          ),
          loading: false,
          recommendations: null,
        });
      }
    },
  }));
