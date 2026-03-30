import { API_REMOVE_EMP_COVER_LETTER_URL } from "@/utils/constants/apis/employee_url";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
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
          API_REMOVE_EMP_COVER_LETTER_URL(employeeID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing employee's coverLetter.",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }));
