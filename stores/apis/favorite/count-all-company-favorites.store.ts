import { API_COUNT_ALL_COMPANY_FAVORITES } from "@/utils/constants/apis/favorite_url";
import axios from "axios";
import { create } from "zustand";

type TCountAllCompanyFavoriteResponse = {
  totalFavorites: number;
};
type TCountAllCompanyFavoriteState = {
  totalAllCompanyFavorites: number | null;
  loading: boolean;
  error: string | null;
  countAllCompanyFavorites: (companyId: string) => Promise<void>;
};

export const useCountAllCompanyFavoritesStore =
  create<TCountAllCompanyFavoriteState>((set) => ({
    totalAllCompanyFavorites: null,
    loading: false,
    error: null,
    countAllCompanyFavorites: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountAllCompanyFavoriteResponse>(
          API_COUNT_ALL_COMPANY_FAVORITES(companyId)
        );

        set({
          totalAllCompanyFavorites: response.data.totalFavorites,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            error: error.response?.data.message,
            loading: false,
            totalAllCompanyFavorites: null,
          });
        else
          set({
            error: "Failed to count all company favorites",
            loading: false,
            totalAllCompanyFavorites: null,
          });
      }
    },
  }));
