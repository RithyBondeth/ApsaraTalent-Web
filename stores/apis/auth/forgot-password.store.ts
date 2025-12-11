import { API_AUTH_FORGOT_PASSWORD_URL } from "@/utils/constants/apis/auth_url";
import axios from "axios";
import { create } from "zustand";

type TForgotPasswordResponse = {
  message: string | null;
};

type TForgotPasswordState = TForgotPasswordResponse & {
  loading: boolean;
  error: string | null;
  forgotPassword: (identifier: string) => Promise<void>;
};

export const useForgotPasswordStore = create<TForgotPasswordState>()((set) => ({
  message: null,
  loading: false,
  error: null,
  forgotPassword: async (identifier: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_FORGOT_PASSWORD_URL, {
        identifier: identifier,
      });
      set({ loading: false, message: response.data.message, error: null });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
          message: error.response?.data?.message || "Something went wrong",
        });
      } else {
        set({
          loading: false,
          error: "An error occurred while forgetting password",
          message: "An error occurred while forgetting password",
        });
      }
    }
  },
}));
