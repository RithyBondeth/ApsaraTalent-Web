import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import {
  API_EMPLOYEE_FAVORITE_COMPANY_URL,
  API_EMPLOYEE_UNFAVORITE_COMPANY_URL,
} from "@/utils/constants/apis/favorite_url";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_PERSIST_KEYS } from "../../shared/persist-keys";

export type TEmployeeFavCompanyState = {
  favoriteCompanyIds: Set<string>;
  message: string | null;
  loading: boolean;
  empFavError: string | null;
  isFavorite: (companyID: string) => boolean;
  addCompanyToFavorite: (
    employeeID: string,
    companyID: string,
  ) => Promise<void>;
  removeCompanyFromFavorite: (
    employeeID: string,
    companyID: string,
    favoriteID: string,
  ) => Promise<void>;
  clearFavorites: () => void;
};

export const useEmployeeFavCompanyStore = create<TEmployeeFavCompanyState>()(
  persist(
    (set, get) => ({
      favoriteCompanyIds: new Set(),
      message: null,
      loading: false,
      empFavError: null,

      isFavorite: (companyID: string) => {
        const isFavorite = get().favoriteCompanyIds.has(companyID);
        return isFavorite;
      },

      addCompanyToFavorite: async (employeeID, companyID) => {
        // Optimistic update — hide the save button immediately
        set((state) => ({
          favoriteCompanyIds: new Set(state.favoriteCompanyIds).add(companyID),
          loading: true,
          empFavError: null,
        }));

        try {
          const response = await axios.post<{ message: string }>(
            API_EMPLOYEE_FAVORITE_COMPANY_URL(employeeID, companyID),
          );
          set({ loading: false, message: response.data.message });
        } catch (error) {
          // Roll back optimistic update on failure
          let errorMessage = "Failed to add favorite";
          set((state) => {
            const rolled = new Set(state.favoriteCompanyIds);
            rolled.delete(companyID);
            errorMessage = extractApiErrorMessage(
              error,
              "Failed to add favorite",
            );
            return {
              favoriteCompanyIds: rolled,
              loading: false,
              empFavError: errorMessage,
              message: errorMessage,
            };
          });
          throw new Error(errorMessage);
        }
      },

      removeCompanyFromFavorite: async (employeeID, companyID, favoriteID) => {
        // Optimistic update — remove immediately from Set
        set((state) => {
          const updated = new Set(state.favoriteCompanyIds);
          updated.delete(companyID);
          return {
            favoriteCompanyIds: updated,
            loading: true,
            empFavError: null,
          };
        });

        try {
          const response = await axios.post<{ message: string }>(
            API_EMPLOYEE_UNFAVORITE_COMPANY_URL(
              employeeID,
              companyID,
              favoriteID,
            ),
          );
          set({
            loading: false,
            message: response.data.message,
            empFavError: null,
          });
        } catch (error) {
          // Roll back — add ID back to Set
          let errorMessage = "Failed to remove company from favorite";
          set((state) => {
            const rolledBack = new Set(state.favoriteCompanyIds).add(companyID);
            errorMessage = extractApiErrorMessage(
              error,
              "Failed to remove company from favorite",
            );
            return {
              favoriteCompanyIds: rolledBack,
              loading: false,
              empFavError: errorMessage,
              message: errorMessage,
            };
          });
          throw new Error(errorMessage);
        }
      },

      clearFavorites: () => {
        set({
          favoriteCompanyIds: new Set(),
          message: null,
          empFavError: null,
        });
      },
    }),
    {
      name: STORE_PERSIST_KEYS.employeeFavoriteCompany,
      partialize: (state) => ({
        favoriteCompanyIds: Array.from(state.favoriteCompanyIds),
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        favoriteCompanyIds: new Set(
          (persistedState as { favoriteCompanyIds?: string[] })
            ?.favoriteCompanyIds ?? [],
        ),
      }),
    },
  ),
);
