import { API_AUTH_LOGIN_URL } from "@/utils/constants/apis/auth_url";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next";
import { useGetCurrentUserStore } from "../users/get-current-user.store";

type TLoginResponse = {
  accessToken: string | null;
  refreshToken: string | null;
  message: string | null;
};

type TLoginState = TLoginResponse & {
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  isInitialized: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  clearToken: () => void;
  initialize: () => void;
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
  isInitialized: false,
  initialize: () => {
    const local = useLocalLoginStore.getState();
    const session = useSessionLoginStore.getState();
    const source = local.accessToken ? local : session;

    if (source.accessToken) {
      set({
        accessToken: source.accessToken,
        refreshToken: source.refreshToken,
        message: source.message,
        rememberMe: source === local,
      isInitialized: true
      });
    } else {
      set({ isInitialized: true });
    }
  },
  login: async (identifier: string, password: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(API_AUTH_LOGIN_URL, {
        identifier: identifier,
        password: password,
      });
      console.log("Login Response: ", response);
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
        isInitialized: true
      });
      setCookie('auth-token', accessToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days for "remember me"
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          loading: false,
          error: error.response?.data?.message || error.message,
          message: error.response?.data?.message || "Something went wrong",
          isInitialized: true
        });
      } else {
        set({
          loading: false,
          error: "An error occurred while login",
          message: "An error occurred while login",
          isInitialized: true
        });
      }
    }
  },
  clearToken: () => {
    localStorage.removeItem("LoginStore-local");
    sessionStorage.removeItem("LoginStore-session");
    deleteCookie('auth-token');
    useGetCurrentUserStore.getState().clearUser();
    set({
      accessToken: null,
      refreshToken: null,
      message: null,
      rememberMe: false,
     isInitialized: true
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
