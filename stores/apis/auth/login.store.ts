import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

type TLoginResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TLoginState = TLoginResponse & {
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  clearToken: () => void;
};

export const useLoginStore = create<TLoginState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
      loading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post<TLoginResponse>(
            API_AUTH_LOGIN_URL,
            {
              email: email,
              password: password,
            }
          );
          set({
            loading: false,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            message: response.data.message,
            error: null,
          });
        } catch (error) {
          if (axios.isAxiosError(error)) 
            set({
              loading: false,
              error: error.response?.data?.message || error.message,
              message: error.response?.data?.message || "Something went wrong"
            });
          else 
          set({
            loading: false,
            error: "An error occurred while login",
            message: "An error occurred while login"
          });
        }
      },
      clearToken: () => set({ accessToken: null, refreshToken: null, message: null }),
    }),
    {
      name: "LoginStore",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        message: state.message,
      }),
    }
  )
);
