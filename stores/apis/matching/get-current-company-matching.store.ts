import { API_GET_CURRENT_COMPANY_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetCurrentCompanyMatchingResponse = IEmployee[];
type TGetCurrentCompanyMatchingState = {
  currentCompanyMatching: TGetCurrentCompanyMatchingResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentCompanyMatching: (companyId: string) => Promise<void>;
};

export const useGetCurrentCompanyMatchingStore =
  create<TGetCurrentCompanyMatchingState>((set) => ({
    currentCompanyMatching: null,
    loading: false,
    error: null,
    queryCurrentCompanyMatching: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentCompanyMatchingResponse>(
          API_GET_CURRENT_COMPANY_MATCHING_URL(companyId)
        );
        console.log("Get Current Company Matching Response: ", response);
        set({
          currentCompanyMatching: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data?.message,
            loading: false,
            currentCompanyMatching: null,
          });
        else
          set({
            error: "Failed to get current company matching",
            loading: false,
            currentCompanyMatching: null,
          });
      }
    },
  }));
