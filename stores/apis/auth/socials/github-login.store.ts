import { setCookie, deleteCookie } from "cookies-next";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_GITHUB_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";

// --- Types ---
export type TGithubLoginResponse = {
  newUser: boolean | null;
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  username: string | null;
  picture: string | null;
  provider: string | null;
  role: string | null;
};

export type TGithubLoginState = TGithubLoginResponse & {
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  rememberMe: boolean;
  setRole: (role: TUserRole) => void;
  githubLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

// --- Constants ---
const FRONTEND_ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const BACKEND_ORIGIN = API_AUTH_SOCIAL_GITHUB_URL.split("/social")[0];

// --- Shared Logic ---
const FINISH_LOGIN = (data: TGithubLoginResponse, rememberMe: boolean) => {
  if (!data) return;

  useGithubLoginStore.setState({
    ...data,
    loading: false,
    isInitialized: true,
    rememberMe,
  });

  if (data.accessToken) {
    const setter = rememberMe
      ? useLocalGithubLoginStore.setState
      : useSessionGithubLoginStore.setState;

    setter({ ...data });

    setCookie("auth-token", data.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
};

// --- Main Store ---
export const useGithubLoginStore = create<TGithubLoginState>((set) => ({
  newUser: null,
  message: null,
  accessToken: null,
  refreshToken: null,
  email: null,
  username: null,
  picture: null,
  provider: null,
  role: null,
  loading: false,
  error: null,
  isInitialized: false,
  rememberMe: false,

  setRole: (role: TUserRole) => set({ role }),

  initialize: () => {
    const local = useLocalGithubLoginStore.getState();
    const session = useSessionGithubLoginStore.getState();
    const src = local.accessToken ? local : session;
    if (src.accessToken) {
      set({ ...src, rememberMe: src === local, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  githubLogin: (rememberMe: boolean, usePopup = true) => {
    set({ loading: true, error: null, rememberMe });

    const url = API_AUTH_SOCIAL_GITHUB_URL;

    if (!usePopup) {
      window.location.href = url;
      return;
    }

    const popup = window.open(url, "github-oauth", "width=500,height=600");
    if (!popup) {
      set({ loading: false, error: "Popup blocked by browser" });
      return;
    }

    const handler = (ev: MessageEvent<TGithubLoginResponse>) => {
      if (ev.origin !== BACKEND_ORIGIN) return;
      window.removeEventListener("message", handler);
      popup.close();
      console.log("GitHub Data Response: ", ev.data);
      FINISH_LOGIN(ev.data, rememberMe);
    };

    window.addEventListener("message", handler);
  },

  clearToken: () => {
    localStorage.removeItem("GithubLoginStore-local");
    sessionStorage.removeItem("GithubLoginStore-session");
    deleteCookie("auth-token");
    useGetCurrentUserStore.getState().clearUser();
    set({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      username: null,
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
export const useLocalGithubLoginStore = create(
  persist<TGithubLoginResponse>(
    () => ({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      username: null,
      picture: null,
      provider: null,
      role: null,
    }),
    {
      name: "GithubLoginStore-local",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// --- Persistent Session Store ---
export const useSessionGithubLoginStore = create(
  persist<TGithubLoginResponse>(
    () => ({
      newUser: null,
      message: null,
      accessToken: null,
      refreshToken: null,
      email: null,
      username: null,
      picture: null,
      provider: null,
      role: null,
    }),
    {
      name: "GithubLoginStore-session",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);