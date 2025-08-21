import { API_GET_CURRENT_EMPLOYEE_MATCHING_URL } from "@/utils/constants/apis/matching_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import axios from "@/lib/axios";
import { create } from "zustand";

type TGetCurrentEmployeeMatchingResponse = ICompany[];
type TGetCurrentEmployeeMatchingState = {
  currentEmployeeMatching: TGetCurrentEmployeeMatchingResponse | null;
  loading: boolean;
  error: string | null;
  queryCurrentEmployeeMatching: (employeeId: string) => Promise<void>;
};

export const useGetCurrentEmployeeMatchingStore =
  create<TGetCurrentEmployeeMatchingState>((set) => ({
    currentEmployeeMatching: null,
    loading: false,
    error: null,
    queryCurrentEmployeeMatching: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetCurrentEmployeeMatchingResponse>(
          API_GET_CURRENT_EMPLOYEE_MATCHING_URL(employeeId)
        );
        console.log("Get Current Employee Matching Response: ", response);
        set({
          currentEmployeeMatching: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data?.message,
            loading: false,
            currentEmployeeMatching: null,
          });
        else
          set({
            error: "Failed to get current employee matching",
            loading: false,
            currentEmployeeMatching: null,
          });
      }
    },
  }));
