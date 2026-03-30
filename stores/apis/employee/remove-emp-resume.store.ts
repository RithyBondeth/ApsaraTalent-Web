import { API_REMOVE_EMP_RESUME_URL } from "@/utils/constants/apis/employee_url";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Remove Employee Resume API Response ───────────────────────────────
type TRemoveEmpResumeResponse = {
  message: string | null;
};

// ── Remove Employee Resume State ────────────────────────────────────────
type TRemoveEmpResumeStoreState = TRemoveEmpResumeResponse & {
  loading: boolean;
  error: string | null;
  removeEmpResume: (employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useRemoveEmpResumeStore = create<TRemoveEmpResumeStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeEmpResume: async (employeeID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveEmpResumeResponse>(
          API_REMOVE_EMP_RESUME_URL(employeeID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing employee's resume.",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
