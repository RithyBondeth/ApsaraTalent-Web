import { API_COMPANY_FAVORITE_EMPLOYEE_URL } from "@/utils/constants/apis/favorite_url";
import axios from "axios";
import { create } from "zustand";

export type TCompanyFavEmployeeState = {
  message: string | null;
  loading: boolean;
  error: string | null;
  addEmployeeToFavorite: (
    companyID: string,
    employeeID: string,
    accessToken: string
  ) => Promise<void>;
};

export const useCompanyFavEmployeeStore = create<TCompanyFavEmployeeState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    addEmployeeToFavorite: async (
      companyID: string,
      employeeID: string,
      accessToken: string
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.post<{ message: string }>(
          API_COMPANY_FAVORITE_EMPLOYEE_URL(companyID, employeeID),
          undefined,
          { headers: { Authorization: `Bearer ${accessToken}` } }
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
            error: "An error occurred while adding employee to favorite",
          });
        }
      }
    },
  })
);


