import { API_COMPANY_FAVORITE_EMPLOYEE_URL } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";

export type TCompanyFavEmployeeState = {
  favoriteEmployeeIds: Set<string>; // <--- NEW
  loading: boolean;
  error: string | null;
  message: string | null;

  addEmployeeToFavorite: (
    companyID: string,
    employeeID: string
  ) => Promise<void>;

  isFavorite: (employeeID: string) => boolean;   // <--- NEW
  toggleFavorite: (companyID: string, employeeID: string) => Promise<void>; // <--- NEW
};

export const useCompanyFavEmployeeStore = create<TCompanyFavEmployeeState>(
  (set, get) => ({
    favoriteEmployeeIds: new Set(),

    loading: false,
    error: null,
    message: null,

    isFavorite: (employeeID) => {
      return get().favoriteEmployeeIds.has(employeeID);
    },

    toggleFavorite: async (companyID, employeeID) => {
      const isFav = get().isFavorite(employeeID);
      if (isFav) return; // You can add remove logic later if needed

      await get().addEmployeeToFavorite(companyID, employeeID);
    },

    addEmployeeToFavorite: async (companyID, employeeID) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.post<{ message: string }>(
          API_COMPANY_FAVORITE_EMPLOYEE_URL(companyID, employeeID)
        );

        // Add the new favorite to Set
        set((state) => ({
          favoriteEmployeeIds: new Set(state.favoriteEmployeeIds).add(employeeID),
          loading: false,
          message: response.data.message,
        }));
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