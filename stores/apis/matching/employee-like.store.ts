import { API_MATCHING_EMP_LIKE_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TEmployeeLikeResponse = {
  employeeLiked: boolean;
  companyLiked: boolean;
  isMatched: boolean;
  employee: IEmployee;
  company: ICompany;
};

type TEmployeeLikeState = {
  loading: boolean;
  error: string | null;
  data: TEmployeeLikeResponse | null;
  employeeLike: (employeeID: string, companyID: string) => Promise<void>;
};

export const useEmployeeLikeStore = create<TEmployeeLikeState>((set) => ({
  loading: false,
  error: null,
  data: null,
  employeeLike: async (employeeID: string, companyID: string) => {
    try {
      set({ loading: true, error: null, data: null });

      const response = await axios.post<TEmployeeLikeResponse>(
        API_MATCHING_EMP_LIKE_URL(employeeID, companyID)
      );

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
          error: "Failed to like employee",
          loading: false,
          data: null,
        });
    }
  },
}));
