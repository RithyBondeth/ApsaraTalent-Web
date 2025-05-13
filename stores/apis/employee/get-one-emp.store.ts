import { API_GET_ONE_EMP_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface"
import axios from "axios";
import { create } from "zustand"

type TGetOneEmployeeState = {
    employeeData: IEmployee | null,
    loading: boolean,
    error: string | null,
    queryOneEmployee: (employeeID: string) => Promise<void>,    
}

export const useGetOneEmployeeStore = create<TGetOneEmployeeState>((set) => ({
    employeeData: null,
    loading: false,
    error: null,
    queryOneEmployee: async (employeeID: string) => {
        set({ loading: true, error: null });

        try {
            const response = await axios.get<IEmployee>(API_GET_ONE_EMP_URL(employeeID));
            set({ loading: false, error: null, employeeData: response.data });
        } catch (error) {
            if(axios.isAxiosError(error)) 
                set({ loading: false, error: error.response?.data?.message || error.message })
            else 
                set({ loading: false, error: "An error occurred while fetching one employee" })       
        }
    }
}));