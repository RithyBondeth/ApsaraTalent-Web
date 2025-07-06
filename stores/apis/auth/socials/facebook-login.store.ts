import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_FACEBOOK_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";

// --- Types ---
export type TFacebookLoginResponse = {
  newUser: boolean | null;
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  picture: string | null;
  provider: string | null;
  role: string | null;
};

export type TFacebookLoginState = TFacebookLoginResponse & {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  rememberMe: boolean;
  setRole: (role: TUserRole) => void;
  facebookLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// --- Constants ---
const FRONTEND_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const BACKEND_ORIGIN = API_AUTH_SOCIAL_FACEBOOK_URL.split("/social")[0];

// --- Shared Logic ---
const FINISH_LOGIN = (data: TFacebookLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  useFacebookLoginStore.setState({
    ...data,
    loading: false,
    isInitialized: true,
    rememberMe,
  });

  if (data.accessToken) {
    const setter = rememberMe
      ? useLocalFacebookLoginStore.setState
      : useSessionFacebookLoginStore.setState;

    setter({ ...data });

    setCookie("auth-token", data.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
};

// --- Main Store ---
export const useFacebookLoginStore = create<TFacebookLoginState>((set) => ({
  newUser: null,
  message: null,
  accessToken: null,
  refreshToken: null,
  email: null,
  firstname: null,
  lastname: null,
  picture: null,
  provider: null,
  role: null,
  loading: false,
  error: null,
  isInitialized: false,
  rememberMe: false,

  setRole: (role: TUserRole) => set({ role }),

  initialize: () => {
    const local = useLocalFacebookLoginStore.getState();
    const session = useSessionFacebookLoginStore.getState();
    const src = local.accessToken ? local : session;
    if (src.accessToken) {
      set({ ...src, rememberMe: src === local, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  facebookLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null, rememberMe });

    const url = API_AUTH_SOCIAL_FACEBOOK_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "facebook-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TFacebookLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      popup.close();
      console.log("Facebook Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    localStorage.removeItem("FacebookLoginStore-local");
    sessionStorage.removeItem("FacebookLoginStore-session");
    deleteCookie("auth-token");
    useGetCurrentUserStore.getState().clearUser();
    set({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      firstname: null,
      lastname: null,
      picture: null,
      provider: null,
      loading: false,
      error: null,
      rememberMe: false,
      isInitialized: true,
    });
  },
}));

// --- Persistent Local Store ---
export const useLocalFacebookLoginStore = create(
  persist<TFacebookLoginResponse>(
    () => ({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      firstname: null,
      lastname: null,
      picture: null,
      provider: null,
      role: null,
    }),
    {
      name: "FacebookLoginStore-local",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// --- Persistent Session Store ---
export const useSessionFacebookLoginStore = create(
  persist<TFacebookLoginResponse>(
    () => ({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      firstname: null,
      lastname: null,
      picture: null,
      provider: null,
      role: null,
    }),
    {
      name: "FacebookLoginStore-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);