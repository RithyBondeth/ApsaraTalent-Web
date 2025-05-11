import { API_AUTH_FORGOT_PASSWORD_URL } from "@/utils/constants/apis/auth_url";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type TForgotPasswordResponse = {
  message: string | null;
};

type TForgotPasswordState = TForgotPasswordResponse & {
  loading: boolean;
  error: string | null;
  forgotPassword: (email: string) => Promise<void>;
};

export const useForgotPasswordStore = create<TForgotPasswordState>()(
  persist(
    (set) => ({
      message: null,
      loading: false,
      error: null,
      forgotPassword: async (email: string) => {
        set({ loading: true, error: null });

        try {
          const response = await axios.post(API_AUTH_FORGOT_PASSWORD_URL, {
            email: email,
          });
          set({ loading: false, message: response.data.message, error: null });
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message instanceof Array
                ? error.response.data.message.join(", ")
                : error.response?.data?.message || error.message;

            set({ loading: false, error: errorMessage });
          } else {
            set({
              loading: false,
              error: "An error occurred while forgetting password",
            });
          }
        }
      },
    }),
    {
      name: "ForgotPasswordStore",
      partialize: (state) => ({ message: state.message }),
    }
  )
);
