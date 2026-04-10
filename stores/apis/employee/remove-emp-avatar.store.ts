import { API_REMOVE_EMP_AVATAR_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Remove Employee Avatar API Response ─────────────────────────────────
type TRemoveEmpAvatarResponse = {
  message: string | null;
};

// ── Remove Employee Avatar State ────────────────────────────────────────
type TRemoveEmpAvatarStoreState = TRemoveEmpAvatarResponse & {
  loading: boolean;
  error: string | null;
  removeEmpAvatar: (employeeID: string) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
export const useRemoveEmpAvatarStore = create<TRemoveEmpAvatarStoreState>(
  (set) => ({
    message: null,
    loading: false,
    error: null,
    removeEmpAvatar: async (employeeID: string) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post<TRemoveEmpAvatarResponse>(
          API_REMOVE_EMP_AVATAR_URL(employeeID),
        );
        set({ loading: false, error: null, message: response.data.message });
      } catch (error) {
        const errorMessage = extractApiErrorMessage(
          error,
          "An error occurred while removing employee's avatar.",
        );

        set({ loading: false, error: errorMessage, message: errorMessage });
      }
    },
  }),
);
