import axios from "@/lib/axios";
import {
  API_COMPANY_FAVORITE_EMPLOYEE_URL,
  API_COMPANY_UNFAVORITE_EMPLOYEE_URL,
} from "@/utils/constants/apis/favorite_url";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../../_shared/persist-keys";

export type TCompanyFavEmployeeState = {
  favoriteEmployeeIds: Set<string>;
  message: string | null;
  loading: boolean;
  cmpFavError: string | null;
  isFavorite: (employeeID: string) => boolean;
  addEmployeeToFavorite: (
    companyID: string,
    employeeID: string,
  ) => Promise<void>;
  removeEmployeeFromFavorite: (
    companyID: string,
    employeeID: string,
    favoriteID: string,
  ) => Promise<void>;
  clearFavorite: () => void;
  clearFavorites: () => void;
};

export const useCompanyFavEmployeeStore = create<TCompanyFavEmployeeState>()(
  persist(
    (set, get) => ({
      favoriteEmployeeIds: new Set(),
      loading: false,
      cmpFavError: null,
      message: null,
      isFavorite: (employeeID: string) => {
        const isFavorite = get().favoriteEmployeeIds.has(employeeID);
        return isFavorite;
      },

      addEmployeeToFavorite: async (companyID: string, employeeID: string) => {
        // Optimistic update — hide the save button immediately
        set((state) => ({
          favoriteEmployeeIds: new Set(state.favoriteEmployeeIds).add(
            employeeID,
          ),
          loading: true,
          cmpFavError: null,
        }));

        try {
          const response = await axios.post<{ message: string }>(
            API_COMPANY_FAVORITE_EMPLOYEE_URL(companyID, employeeID),
          );
          set({
            loading: false,
            message: response.data.message,
            cmpFavError: null,
          });
        } catch (error) {
          // Roll back optimistic update on failure
          let errorMessage =
            "An error occurred while adding employee to favorite";
          set((state) => {
            const rolled = new Set(state.favoriteEmployeeIds);
            rolled.delete(employeeID);
            errorMessage = axios.isAxiosError(error)
              ? error.response?.data?.message instanceof Array
                ? error.response.data.message.join(", ")
                : error.response?.data?.message || error.message
              : "An error occurred while adding employee to favorite";
            return {
              favoriteEmployeeIds: rolled,
              loading: false,
              cmpFavError: errorMessage,
              message: errorMessage,
            };
          });
          throw new Error(errorMessage);
        }
      },

      removeEmployeeFromFavorite: async (
        companyID: string,
        employeeID: string,
        favoriteID: string,
      ) => {
        // Optimistic update — remove immediately from Set
        set((state) => {
          const updated = new Set(state.favoriteEmployeeIds);
          updated.delete(employeeID);
          return {
            favoriteEmployeeIds: updated,
            loading: true,
            cmpFavError: null,
          };
        });

        try {
          const response = await axios.post<{ message: string }>(
            API_COMPANY_UNFAVORITE_EMPLOYEE_URL(
              companyID,
              employeeID,
              favoriteID,
            ),
          );
          set({
            loading: false,
            message: response.data.message,
            cmpFavError: null,
          });
        } catch (error) {
          // Roll back — add ID back to Set
          let errorMessage = "Failed to remove employee from favorite";
          set((state) => {
            const rolledBack = new Set(state.favoriteEmployeeIds).add(
              employeeID,
            );
            errorMessage = axios.isAxiosError(error)
              ? error.response?.data?.message || error.message
              : "Failed to remove employee from favorite";
            return {
              favoriteEmployeeIds: rolledBack,
              loading: false,
              cmpFavError: errorMessage,
              message: errorMessage,
            };
          });
          throw new Error(errorMessage);
        }
      },

      clearFavorite: () => {
        set({
          favoriteEmployeeIds: new Set(),
          message: null,
          cmpFavError: null,
        });
      },
      clearFavorites: () => {
        set({
          favoriteEmployeeIds: new Set(),
          message: null,
          cmpFavError: null,
        });
      },
    }),

    {
      name: STORE_PERSIST_KEYS.companyFavoriteEmployee,
      partialize: (state) => ({
        favoriteEmployeeIds: Array.from(state.favoriteEmployeeIds),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favoriteEmployeeIds: new Set(
          (persistedState as { favoriteEmployeeIds?: string[] })
            ?.favoriteEmployeeIds || [],
        ),
      }),
    },
  ),
);
