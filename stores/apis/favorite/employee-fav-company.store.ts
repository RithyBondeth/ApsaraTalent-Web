import {
  API_EMPLOYEE_FAVORITE_COMPANY_URL,
  API_EMPLOYEE_UNFAVORITE_COMPANY_URL,
} from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TEmployeeFavCompanyState = {
  favoriteCompanyIds: Set<string>;
  message: string | null;
  loading: boolean;
  error: string | null;
  isFavorite: (companyID: string) => boolean;
  addCompanyToFavorite: (
    employeeID: string,
    companyID: string
  ) => Promise<void>;
  removeCompanyFromFavorite: (
    employeeID: string,
    companyID: string,
    favoriteID: string
  ) => Promise<void>;
  clearFavorites: () => void;
};

export const useEmployeeFavCompanyStore = create<TEmployeeFavCompanyState>()(
  persist(
    (set, get) => ({
      favoriteCompanyIds: new Set(),
      message: null,
      loading: false,
      error: null,

      isFavorite: (companyID: string) => {
        const isFavorite = get().favoriteCompanyIds.has(companyID);
        return isFavorite;
      },

      addCompanyToFavorite: async (employeeID, companyID) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post<{ message: string }>(
            API_EMPLOYEE_FAVORITE_COMPANY_URL(employeeID, companyID)
          );

          set((state) => ({
            favoriteCompanyIds: new Set(state.favoriteCompanyIds).add(
              companyID
            ),
            loading: false,
            message: response.data.message,
          }));
        } catch (error) {
          set({
            loading: false,
            error: axios.isAxiosError(error)
              ? error.response?.data?.message || error.message
              : "Failed to add favorite",
          });
        }
      },

      removeCompanyFromFavorite: async (employeeID, companyID, favoriteID) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post<{ message: string }>(
            API_EMPLOYEE_UNFAVORITE_COMPANY_URL(
              employeeID,
              companyID,
              favoriteID
            )
          );

          set((state) => {
            const updated = new Set(state.favoriteCompanyIds);
            updated.delete(companyID);

            return {
              favoriteCompanyIds: updated,
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
              : "Failed to remove company from favorite",
          });
        }
      },

      clearFavorites: () => {
        set({
          favoriteCompanyIds: new Set(),
          message: null,
          error: null,
        });
      },
    }),
    {
      name: "employee-favorite-company",
      partialize: (state) => ({
        favoriteCompanyIds: Array.from(state.favoriteCompanyIds),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favoriteCompanyIds: new Set(
          (persistedState as { favoriteCompanyIds?: string[] })
            ?.favoriteCompanyIds ?? []
        ),
      }),
    }
  )
);
