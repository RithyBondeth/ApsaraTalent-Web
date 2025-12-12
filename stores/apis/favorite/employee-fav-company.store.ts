import { API_EMPLOYEE_FAVORITE_COMPANY_URL } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TEmployeeFavCompanyState = {
  favoriteCompanyIds: Set<string>;
  message: string | null;
  loading: boolean;
  error: string | null;
  addCompanyToFavorite: (
    employeeID: string,
    companyID: string
  ) => Promise<void>;
  isFavorite: (companyID: string) => boolean;
};

export const useEmployeeFavCompanyStore = create<TEmployeeFavCompanyState>()(
  persist(
    (set, get) => ({
      favoriteCompanyIds: new Set(),
      message: null,
      loading: false,
      error: null,
      isFavorite: (companyID: string) =>
        get().favoriteCompanyIds.has(companyID),
      addCompanyToFavorite: async (employeeID: string, companyID: string) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post<{ message: string }>(
            API_EMPLOYEE_FAVORITE_COMPANY_URL(employeeID, companyID)
          );
          set((state) => ({
            favoriteCompanyIds: new Set(state.favoriteCompanyIds).add(
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
              error: "An error occurred while adding company to favorite",
            });
          }
        }
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
            ?.favoriteCompanyIds || []
        ),
      }),
    }
  )
);
