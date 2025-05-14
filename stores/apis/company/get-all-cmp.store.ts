import { API_GET_ALL_CMP_URL } from "@/utils/constants/apis/company_url";
import { ICompany } from "@/utils/interfaces/user-interface/company.interface"
import axios from "axios";
import { create } from "zustand"

type TGetAllCompanyState = {
    companyData: ICompany[] | null,
    loading: boolean,
    error: string | null,
    queryCompany: () => Promise<void>,   
}

export const useGetAllCompanyStore = create<TGetAllCompanyState>((set) => ({
    companyData: null,
    loading: false,
    error: null,
    queryCompany: async () => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get<ICompany[]>(API_GET_ALL_CMP_URL);
            set({ loading: false, error: null, companyData: response.data });
        } catch (error) {
            if(axios.isAxiosError(error)) 
                set({ loading: false, error: error.response?.data?.message || error.message })
            else 
                set({ loading: false, error: "An error occurred while fetching all companies" })       
        }
    }
}));