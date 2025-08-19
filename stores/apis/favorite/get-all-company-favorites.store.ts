import { API_FIND_ALL_COMPANY_FAVORITES } from "@/utils/constants/apis/favorite_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "axios";
import { create } from "zustand";

export type TGetAllCompanyFavoritesResponse = {
  id: string;
  createdAt: string;
  employee: IEmployee;
};

export type TGetAllCompanyFavoritesState = {
  employeeData: TGetAllCompanyFavoritesResponse[] | null;
  loading: boolean;
  error: string | null;
  queryAllCompanyFavorites: (
    companyID: string,
    accessToken: string
  ) => Promise<void>;
};

export const useGetAllCompanyFavoritesStore =
  create<TGetAllCompanyFavoritesState>((set) => ({
    employeeData: null,
    loading: false,
    error: null,
    queryAllCompanyFavorites: async (
      companyID: string,
      accessToken: string
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetAllCompanyFavoritesResponse[]>(
          API_FIND_ALL_COMPANY_FAVORITES(companyID),
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        set({ loading: false, error: null, employeeData: response.data });
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
            error: "An error occurred while fetching all company's favorites",
          });
        }
      }
    },
  }));


