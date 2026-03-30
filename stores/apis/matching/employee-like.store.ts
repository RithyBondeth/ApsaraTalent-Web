import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_MATCHING_EMP_LIKE_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user";
import { IEmployee } from "@/utils/interfaces/user";
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
        API_MATCHING_EMP_LIKE_URL(employeeID, companyID),
      );

      set({ loading: false, error: null, data: response.data });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to like employee",
      );
      set({
        error: errorMessage,
        loading: false,
        data: null,
      });
      throw new Error(errorMessage);
    }
  },
}));
