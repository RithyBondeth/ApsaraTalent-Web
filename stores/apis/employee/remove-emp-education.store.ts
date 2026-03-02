import { API_REMOVE_EMP_EDUCATION_URL } from "@/utils/constants/apis/employee_url";
import axios from "axios";
import { create } from "zustand";

type TRemoveEmpEducationResponse = {
  message: string | null;
};

type TRemoveEducationStoreState = TRemoveEmpEducationResponse & {
  loading: boolean;
  error: string | null;
  removeEducation: (employeeID: string, educationID: string) => Promise<void>;
};

export const useRemoveEmpEducationStore = create<TRemoveEducationStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeEducation: async (employeeID: string, educationID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveEmpEducationResponse>(
          API_REMOVE_EMP_EDUCATION_URL(employeeID, educationID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message instanceof Array
              ? error.response.data.message.join(", ")
              : error.response?.data?.message || error.message;

          set({ loading: false, error: errorMessage, message: errorMessage });
        } else {
          set({
            loading: false,
            error: "An error occurred while removing employee's education.",
            message: "An error occurred while removing employee's education.",
          });
        }
      }
    },
  }),
);
