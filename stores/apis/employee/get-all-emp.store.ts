import { API_GET_ALL_EMP_URL } from "@/utils/constants/apis/employee_url";
import { IEmployee } from "@/utils/interfaces/user-interface/employee.interface";
import axios from "axios";
import { create } from "zustand";

type TGetAllEmployeeState = {
  employeesData: IEmployee[] | null;
  loading: boolean;
  error: string | null;
  queryEmployee: (token: string) => Promise<void>;
};

export const useGetAllEmployeeStore = create<TGetAllEmployeeState>((set) => ({
  employeesData: null,
  loading: false,
  error: null,
  queryEmployee: async (token: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<IEmployee[]>(
        API_GET_ALL_EMP_URL,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set({ loading: false, error: null, employeesData: response.data });
    } catch (error) {
      if (axios.isAxiosError(error))
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
        });
      else
        set({
          loading: false,
          error: "An error occurred while fetching all employees",
        });
    }
  },
}));
