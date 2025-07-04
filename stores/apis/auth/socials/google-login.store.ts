import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_FACEBOOK_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";

export type TGoogleLoginResponse = {
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

export type TGoogleLoginState = TGoogleLoginResponse & {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  rememberMe: boolean;
  setRole: (role: TUserRole) => void;
  googleLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

const FRONTEND_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const BACKEND_ORIGIN = API_AUTH_SOCIAL_FACEBOOK_URL.split("/social")[0];

// ✅ PATCHED: Always update store, only persist/token if accessToken exists
const FINISH_LOGIN = (data: TGoogleLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  // Always update Zustand in-memory store
  useGoogleLoginStore.setState({
    ...data,
    loading: false,
    isInitialized: true,
    rememberMe,
  });

  // Only persist & set cookie if accessToken exists
  if (data.accessToken) {
    const setter = rememberMe
      ? useLocalGoogleLoginStore.setState
      : useSessionGoogleLoginStore.setState;

    setter({ ...data });

    setCookie("auth-token", data.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
};

export const useGoogleLoginStore = create<TGoogleLoginState>((set) => ({
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
  setRole: (role: TUserRole) => set({ role: role }),
  initialize: () => {
    const local = useLocalGoogleLoginStore.getState();
    const session = useSessionGoogleLoginStore.getState();
    const src = local.accessToken ? local : session;
    if (src.accessToken) {
      set({ ...src, rememberMe: src === local, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  googleLogin: (rememberMe: boolean, usePopup: boolean = true) => {
    set({ loading: true, error: null, rememberMe });

    const url = API_AUTH_SOCIAL_FACEBOOK_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "google-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TGoogleLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      popup.close();
      console.log("Google Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    localStorage.removeItem("GoogleLoginStore-local");
    sessionStorage.removeItem("GoogleLoginStore-session");
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

export const useLocalGoogleLoginStore = create(
  persist<TGoogleLoginResponse>(
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
      name: "GoogleLoginStore-local",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useSessionGoogleLoginStore = create(
  persist<TGoogleLoginResponse>(
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
      name: "GoogleLoginStore-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);