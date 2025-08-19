import { API_FIND_ALL_EMPLOYEE_FAVORITES } from "@/utils/constants/apis/favorite_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import axios from "axios";
import { create } from "zustand";

export type TGetAllEmployeeFavoritesResponse = {
  id: string;
  createdAt: string;
  company: ICompany;
};

export type TGetAllEmployeeFavoritesState = {
  companyData: TGetAllEmployeeFavoritesResponse[] | null;
  loading: boolean;
  error: string | null;
  queryAllEmployeeFavorites: (
    employeeID: string,
    accessToken: string
  ) => Promise<void>;
};

export const useGetAllEmployeeFavoritesStore =
  create<TGetAllEmployeeFavoritesState>((set) => ({
    companyData: null,
    loading: false,
    error: null,
    queryAllEmployeeFavorites: async (
      employeeID: string,
      accessToken: string
    ) => {
      set({ loading: true, error: null });

      try {
        const response = await axios.get<TGetAllEmployeeFavoritesResponse[]>(
          API_FIND_ALL_EMPLOYEE_FAVORITES(employeeID),
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        set({ loading: false, error: null, companyData: response.data });
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
            error: "An error occurred while fetching all employee's favorites",
          });
        }
      }
    },
  }));
