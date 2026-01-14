import axios from "@/lib/axios";
import { create } from "zustand";
import { API_GET_ALL_CAREER_SCOPES_URL } from "@/utils/constants/apis/user_url";
import { ICareerScopes } from "@/utils/interfaces/user-interface/company.interface";

type TGetAllCareerScopesStoreState = {
  error: string | null;
  loading: boolean;
  careerScopes: ICareerScopes[] | null;
  getAllCareerScopes: () => Promise<void>;
};

export const useGetAllCareerScopesStore = create<TGetAllCareerScopesStoreState>(
  (set) => ({
    error: null,
    loading: false,
    careerScopes: null,
    getAllCareerScopes: async () => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<[]>(API_GET_ALL_CAREER_SCOPES_URL);
        set({ careerScopes: response.data, loading: false, error: null });
      } catch (error) {
        if (axios.isAxiosError(error))
          set({
            loading: false,
            error: error.response?.data?.message || error.message,
          });
        else
          set({
            loading: false,
            error: "An error occurred while fetching all career scopes",
          });
      }
    },
  })
);
