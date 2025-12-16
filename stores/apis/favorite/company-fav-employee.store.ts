import {
  API_COMPANY_FAVORITE_EMPLOYEE_URL,
  API_COMPANY_UNFAVORITE_EMPLOYEE_URL,
} from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TCompanyFavEmployeeState = {
  favoriteEmployeeIds: Set<string>;
  message: string | null;
  loading: boolean;
  error: string | null;
  isFavorite: (employeeID: string) => boolean;
  addEmployeeToFavorite: (
    companyID: string,
    employeeID: string
  ) => Promise<void>;
  removeEmployeeFromFavorite: (
    companyID: string,
    employeeID: string,
    favoriteID: string
  ) => Promise<void>;
  clearFavorite: () => void;
};

export const useCompanyFavEmployeeStore = create<TCompanyFavEmployeeState>()(
  persist(
    (set, get) => ({
      favoriteEmployeeIds: new Set(),
      loading: false,
      error: null,
      message: null,
      isFavorite: (employeeID: string) => {
        const isFavorite = get().favoriteEmployeeIds.has(employeeID);
        return isFavorite;
      },

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
            error: null,
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

      removeEmployeeFromFavorite: async (
        companyID: string,
        employeeID: string,
        favoriteID: string
      ) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post<{ message: string }>(
            API_COMPANY_UNFAVORITE_EMPLOYEE_URL(
              companyID,
              employeeID,
              favoriteID
            )
          );

          set((state) => {
            const updated = new Set(state.favoriteEmployeeIds);
            updated.delete(employeeID);

            return {
              favoriteEmployeeIds: updated,
              loading: false,
              message: response.data.message,
              error: null,
            };
          });
        } catch (error) {
          set({
            loading: false,
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || error.message
              : "Failed to remove employee from favorite",
          });
        }
      },

      clearFavorite: () => {
        set({
          favoriteEmployeeIds: new Set(),
          message: null,
          error: null,
        });
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
