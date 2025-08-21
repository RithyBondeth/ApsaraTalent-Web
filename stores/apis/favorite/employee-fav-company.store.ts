import { API_EMPLOYEE_FAVORITE_COMPANY_URL } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";

export type TEmployeeFavCompanyState = {
  message: string | null;
  loading: boolean;
  error: string | null;
  addCompanyToFavorite: (
    employeeID: string,
    companyID: string
  ) => Promise<void>;
};

export const useEmployeeFavCompanyStore = create<TEmployeeFavCompanyState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    addCompanyToFavorite: async (
      employeeID: string,
      companyID: string
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.post<{ message: string }>(
          API_EMPLOYEE_FAVORITE_COMPANY_URL(employeeID, companyID)
        );

        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while adding company to favorite",
          });
        }
      }
    },
  })
);
