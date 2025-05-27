import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import axios from "axios";

type TLoginResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TLoginState = TLoginResponse & {
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<void>;
  clearToken: () => void;
};

type TLoginStoreState = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

export const useLoginStore = create<TLoginState>((set) => ({
  accessToken: null,
  refreshToken: null,
  message: null,
  loading: false,
  error: null,
  login: async (identifier: string, password: string) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });

      const { accessToken, refreshToken, message } = response.data;

      set({
        accessToken,
        refreshToken,
        message,
        loading: false,
        error: null,
      });
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
          error: "An error occurred while login",
          message: "An error occurred while login",
        });
      }
    }
  },
  clearToken: () => {
    localStorage.removeItem("LoginStore-local");
    sessionStorage.removeItem("LoginStore-session");
    set({
      accessToken: null,
      refreshToken: null,
      message: null,
    });
  },
}));