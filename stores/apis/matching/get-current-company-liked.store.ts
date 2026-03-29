import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/_shared/api-error-message";
import { API_GET_CURRENT_COMPANY_LIKED_URL } from "@/utils/constants/apis/matching_url";
import { IEmployee } from "@/utils/interfaces/user";
import { create } from "zustand";

type TGetCurrentCompanyLikedResponse = IEmployee[];
type TGetCurrentCompanyLikedState = {
  currentCompanyLiked: TGetCurrentCompanyLikedResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentCompanyLiked: (companyId: string) => Promise<void>;
  /** Optimistically add an employee to the liked list so the card disappears instantly */
  optimisticAddLiked: (employee: IEmployee) => void;
};

export const useGetCurrentCompanyLikedStore =
  create<TGetCurrentCompanyLikedState>((set, get) => ({
    currentCompanyLiked: null,
    loading: false,
    error: null,
    optimisticAddLiked: (employee: IEmployee) => {
      const current = get().currentCompanyLiked ?? [];
      if (!current.some((e) => e.id === employee.id)) {
        set({ currentCompanyLiked: [...current, employee] });
      }
    },
    queryCurrentCompanyLiked: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentCompanyLikedResponse>(
          API_GET_CURRENT_COMPANY_LIKED_URL(companyId),
        );

        set({
          currentCompanyLiked: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(error, "Failed to get current company liked"),
          loading: false,
          currentCompanyLiked: null,
        });
      }
    },
  }));
