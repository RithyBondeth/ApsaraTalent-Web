import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_MATCHING_CMP_LIKE_URL } from "@/utils/constants/apis/matching.api.constant";
import { ICompany } from "@/utils/interfaces/user/company.interface";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Company Like API Response ────────────────────────────
type TCompanyLikeResponse = {
  employeeLiked: boolean;
  companyLiked: boolean;
  isMatched: boolean;
  employee: IEmployee;
  company: ICompany;
};

// ── Company Like State ──────────────────────────────────
type TCompanyLikeState = {
  loading: boolean;
  error: string | null;
  data: TCompanyLikeResponse | null;
  companyLike: (companyID: string, employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useCompanyLikeStore = create<TCompanyLikeState>((set) => ({
  loading: false,
  error: null,
  data: null,
  companyLike: async (companyID: string, employeeID: string) => {
    try {
      set({ loading: true, error: null, data: null });

      const response = await axios.post<TCompanyLikeResponse>(
        API_MATCHING_CMP_LIKE_URL(companyID, employeeID),
      );

      set({ loading: false, error: null, data: response.data });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "Failed to like company",
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
