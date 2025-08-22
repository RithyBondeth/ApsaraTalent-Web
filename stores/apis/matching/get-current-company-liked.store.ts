import { API_GET_CURRENT_COMPANY_LIKED_URL } from "@/utils/constants/apis/matching_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetCurrentCompanyLikedResponse = IEmployee[];
type TGetCurrentCompanyLikedState = {
  currentCompanyLiked: TGetCurrentCompanyLikedResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentCompanyLiked: (companyId: string) => Promise<void>;
};

export const useGetCurrentCompanyLikedStore =
  create<TGetCurrentCompanyLikedState>((set) => ({
    currentCompanyLiked: null,
    loading: false,
    error: null,
    queryCurrentCompanyLiked: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentCompanyLikedResponse>(
          API_GET_CURRENT_COMPANY_LIKED_URL(companyId)
        );
      
        set({
          currentCompanyLiked: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data?.message,
            loading: false,
            currentCompanyLiked: null,
          });
        else
          set({
            error: "Failed to get current company liked",
            loading: false,
            currentCompanyLiked: null,
          });
      }
    },
  }));
2