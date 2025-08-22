import { API_GET_CURRENT_EMPLOYEE_LIKED_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetCurrentEmployeeLikedResponse = ICompany[];
type TGetCurrentEmployeeLikedState = {
  currentEmployeeLiked: TGetCurrentEmployeeLikedResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentEmployeeLiked: (employeeId: string) => Promise<void>;
};

export const useGetCurrentEmployeeLikedStore =
  create<TGetCurrentEmployeeLikedState>((set) => ({
    currentEmployeeLiked: null,
    loading: false,
    error: null,
    queryCurrentEmployeeLiked: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentEmployeeLikedResponse>(
          API_GET_CURRENT_EMPLOYEE_LIKED_URL(employeeId)
        );
       
        set({
          currentEmployeeLiked: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data?.message,
            loading: false,
            currentEmployeeLiked: null,
          });
        else
          set({
            error: "Failed to get current employee liked",
            loading: false,
            currentEmployeeLiked: null,
          });
      }
    },
  }));
