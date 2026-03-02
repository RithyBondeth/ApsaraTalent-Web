import { API_REMOVE_EMP_RESUME_URL } from "@/utils/constants/apis/employee_url";
import axios from "axios";
import { create } from "zustand";

type TRemoveEmpCoverLetterResponse = {
  message: string | null;
};

type TRemoveEmpCoverLetterStoreState = TRemoveEmpCoverLetterResponse & {
  loading: boolean;
  error: string | null;
  removeEmpCoverLetter: (employeeID: string) => Promise<void>;
};

export const useRemoveEmpCoverLetterStore =
  create<TRemoveEmpCoverLetterStoreState>((set) => ({
    message: null,
    loading: false,
    error: null,
    removeEmpCoverLetter: async (employeeID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveEmpCoverLetterResponse>(
          API_REMOVE_EMP_RESUME_URL(employeeID),
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
            error: "An error occurred while removing employee's coverLetter.",
            message: "An error occurred while removing employee's coverLetter.",
          });
        }
      }
    },
  }));
