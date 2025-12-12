import { API_COMPANY_FAVORITE_EMPLOYEE_URL } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TCompanyFavEmployeeState = {
  favoriteEmployeeIds: Set<string>;
  message: string | null;
  loading: boolean;
  error: string | null;
  addEmployeeToFavorite: (
    companyID: string,
    employeeID: string
  ) => Promise<void>;
  isFavorite: (employeeID: string) => boolean;
};

export const useCompanyFavEmployeeStore = create<TCompanyFavEmployeeState>()(
  persist(
    (set, get) => ({
      favoriteEmployeeIds: new Set(),
      loading: false,
      error: null,
      message: null,
      isFavorite: (employeeID: string) =>
        get().favoriteEmployeeIds.has(employeeID),
      addEmployeeToFavorite: async (companyID: string, employeeID: string) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post<{ message: string }>(
            API_COMPANY_FAVORITE_EMPLOYEE_URL(companyID, employeeID)
          );
          set((state) => ({
            favoriteEmployeeIds: new Set(state.favoriteEmployeeIds).add(
              employeeID
            ),
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
    }),

    {
      name: "company-favorite-employee",
      partialize: (state) => ({
        favoriteEmployeeIds: Array.from(state.favoriteEmployeeIds),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favoriteEmployeeIds: new Set(
          (persistedState as { favoriteEmployeeIds?: string[] })
            ?.favoriteEmployeeIds || []
        ),
      }),
    }
  )
);
