import { API_MATCHING_CMP_LIKE_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TCompanyLikeResponse = {
  employeeLiked: boolean;
  companyLiked: boolean;
  isMatched: boolean;
  employee: IEmployee;
  company: ICompany;
};

type TCompanyLikeState = {
  loading: boolean;
  error: string | null;
  data: TCompanyLikeResponse | null;
  companyLike: (companyID: string, employeeID: string) => Promise<void>;
};

export const useCompanyLikeStore = create<TCompanyLikeState>((set) => ({
  loading: false,
  error: null,
  data: null,
  companyLike: async (companyID: string, employeeID: string) => {
    try {
      set({ loading: true, error: null, data: null });

      const response = await axios.post<TCompanyLikeResponse>(
        API_MATCHING_CMP_LIKE_URL(companyID, employeeID)
      );
      console.log(`Company Like Response: ${response}`);

      set({ loading: false, error: null, data: response.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          error: error.response?.data?.message,
          loading: false,
          data: null,
        });
      else
        set({
          error: "Failed to like company",
          loading: false,
          data: null,
        });
    }
  },
}));
