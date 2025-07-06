import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_LINKEDIN_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";

// --- Types ---
export type TLinkedInLoginResponse = {
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

export type TLinkedInLoginState = TLinkedInLoginResponse & {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  rememberMe: boolean;
  setRole: (role: TUserRole) => void;
  linkedinLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// --- Constants ---
const FRONTEND_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const BACKEND_ORIGIN = API_AUTH_SOCIAL_LINKEDIN_URL.split("/social")[0];

// --- Shared Logic ---
const FINISH_LOGIN = (data: TLinkedInLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  useLinkedInLoginStore.setState({
    ...data,
    loading: false,
    isInitialized: true,
    rememberMe,
  });

  if (data.accessToken) {
    const setter = rememberMe
      ? useLocalLinkedInLoginStore.setState
      : useSessionLinkedInLoginStore.setState;

    setter({ ...data });

    setCookie("auth-token", data.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
};

// --- Main Store ---
export const useLinkedInLoginStore = create<TLinkedInLoginState>((set) => ({
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
    const local = useLocalLinkedInLoginStore.getState();
    const session = useSessionLinkedInLoginStore.getState();
    const src = local.accessToken ? local : session;
    if (src.accessToken) {
      set({ ...src, rememberMe: src === local, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  linkedinLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null, rememberMe });

    const url = API_AUTH_SOCIAL_LINKEDIN_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "linkedin-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TLinkedInLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      popup.close();
      console.log("LinkedIn Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    localStorage.removeItem("LinkedInLoginStore-local");
    sessionStorage.removeItem("LinkedInLoginStore-session");
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
export const useLocalLinkedInLoginStore = create(
  persist<TLinkedInLoginResponse>(
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
      name: "LinkedInLoginStore-local",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// --- Persistent Session Store ---
export const useSessionLinkedInLoginStore = create(
  persist<TLinkedInLoginResponse>(
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
      name: "LinkedInLoginStore-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);