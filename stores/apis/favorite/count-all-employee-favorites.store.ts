import { API_COUNT_ALL_EMPLOYEE_FAVORITES } from "@/utils/constants/apis/favorite_url";
import axios from "axios";
import { create } from "zustand";

type TCountAllEmployeeFavoriteResponse = {
  totalFavorites: number;
};
type TCountAllEmployeeFavoriteState = {
  totalAllEmployeeFavorites: number | null;
  loading: boolean;
  error: string | null;
  countAllEmployeeFavorites: (employeeId: string) => Promise<void>;
};

export const useCountAllEmployeeFavoritesStore =
  create<TCountAllEmployeeFavoriteState>((set) => ({
    totalAllEmployeeFavorites: null,
    loading: false,
    error: null,
    countAllEmployeeFavorites: async (employeeId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountAllEmployeeFavoriteResponse>(
          API_COUNT_ALL_EMPLOYEE_FAVORITES(employeeId)
        );

        set({
          totalAllEmployeeFavorites: response.data.totalFavorites,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data.message,
            loading: false,
            totalAllEmployeeFavorites: null,
          });
        else
          set({
            error: "Failed to count all employee favorites",
            loading: false,
            totalAllEmployeeFavorites: null,
          });
      }
    },
  }));
