import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

type TLoginResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TLoginState = TLoginResponse & {
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
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
  rememberMe: false,

  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });

      const { accessToken, refreshToken, message } = response.data;

      if (rememberMe) 
        useLocalLoginStore.setState({ accessToken, refreshToken, message });
      else 
        useSessionLoginStore.setState({ accessToken, refreshToken, message });
      

      set({
        accessToken,
        refreshToken,
        message,
        loading: false,
        error: null,
        rememberMe: rememberMe,
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
      rememberMe: false,
    });
  },
}));

export const useLocalLoginStore = create<TLoginStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
    }),
    {
      name: "LoginStore-local",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSessionLoginStore = create<TLoginStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      message: null,
    }),
    {
      name: "LoginStore-session",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
