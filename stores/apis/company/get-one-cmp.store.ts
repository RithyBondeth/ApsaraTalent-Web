import { API_GET_ONE_CMP_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface";
import axios from "axios";
import { create } from "zustand";

type TGetOneCompanyState = {
  companyData: ICompany | null;
  loading: boolean;
  error: string | null;
  queryOneCompany: (companyID: string, accessToken: string) => Promise<void>;
};

export const useGetOneCompanyStore = create<TGetOneCompanyState>((set) => ({
  companyData: null,
  loading: false,
  error: null,
  queryOneCompany: async (companyID: string, accessToken: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<ICompany>(
        API_GET_ONE_CMP_URL(companyID),
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      set({ loading: false, error: null, companyData: response.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching one company",
        });
    }
  },
}));
