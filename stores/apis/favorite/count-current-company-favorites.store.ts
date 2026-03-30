import { API_COUNT_ALL_COMPANY_FAVORITES } from "@/utils/constants/apis/favorite_url";
import axios from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { create } from "zustand";

type TCountCurrentCompanyFavoriteResponse = {
  totalFavorites: number;
};
type TCountCurrentCompanyFavoriteState = {
  totalCmpFavorites: number | null;
  loading: boolean;
  error: string | null;
  countCurrentCmpFavorites: (companyId: string) => Promise<void>;
};

export const useCountCurrentCompanyFavoritesStore =
  create<TCountCurrentCompanyFavoriteState>((set) => ({
    totalCmpFavorites: null,
    loading: false,
    error: null,
    countCurrentCmpFavorites: async (companyId: string) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TCountCurrentCompanyFavoriteResponse>(
          API_COUNT_ALL_COMPANY_FAVORITES(companyId),
        );

        set({
          totalCmpFavorites: response.data.totalFavorites,
          loading: false,
          error: null,
        });
      } catch (error) {
        set({
          error: extractApiErrorMessage(
            error,
            "Failed to count all company favorites",
          ),
          loading: false,
          totalCmpFavorites: null,
        });
      }
    },
  }));
