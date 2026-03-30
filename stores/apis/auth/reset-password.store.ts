import { API_AUTH_RESET_PASSWORD_URL } from "@/utils/constants/apis/auth_url";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import axios from "axios";
import { create } from "zustand";

type TResetPasswordResponse = {
  message: string | null;
};

type TResetPasswordState = TResetPasswordResponse & {
  loading: boolean;
  error: string | null;
  resetPassword: (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => Promise<void>;
};

export const useResetPasswordStore = create<TResetPasswordState>()((set) => ({
  message: null,
  loading: false,
  error: null,
  resetPassword: async (
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_RESET_PASSWORD_URL(token), {
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      set({ loading: false, message: response.data.message, error: null });
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        "An error occurred while resetting password",
      );
      set({
        loading: false,
        error: errorMessage,
        message: errorMessage,
      });
    }
  },
}));
