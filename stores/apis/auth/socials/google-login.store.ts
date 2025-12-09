// import { setCookie, deleteCookie } from "cookies-next";
// import { create } from "zustand";
// import { useGetCurrentUserStore } from "../../users/get-current-user.store";
// import { API_AUTH_SOCIAL_GOOGLE_URL } from "@/utils/constants/apis/auth_url";
// import { TUserRole } from "@/utils/types/role.type";
// import { EAuthLoginMethod } from "@/utils/constants/auth.constant";

// export type TGoogleLoginResponse = {
//   newUser: boolean | null;
//   message: string | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   email: string | null;
//   firstname: string | null;
//   lastname: string | null;
//   picture: string | null;
//   provider: string | null;
//   role: string | null;
//   lastLoginMethod: EAuthLoginMethod | null;
//   lastLoginAt: string | null;
// };

// export type TGoogleLoginState = {
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   message: string | null;
//   role: string | null;
//   newUser: boolean | null;
//   email: string | null;
//   firstname: string | null;
//   lastname: string | null;
//   lastLoginMethod: EAuthLoginMethod | null;
//   lastLoginAt: string | null;
//   picture: string | null;
//   provider: string | null;
//   setRole: (role: TUserRole) => void;
//   googleLogin: (rememberMe: boolean, usePopup?: boolean) => void;
//   initialize: () => void;
//   clearToken: () => void;
// };

// const BACKEND_ORIGIN = API_AUTH_SOCIAL_GOOGLE_URL.split("/social")[0];

// const FINISH_LOGIN = (data: TGoogleLoginResponse, rememberMe: boolean) => {
//   if (!data) return;

//   // Update Zustand in-memory store
//   useGoogleLoginStore.setState({
//     loading: false,
//     isAuthenticated: !!data.accessToken,
//     message: data.message,
//     role: data.role,
//     newUser: data.newUser,
//     email: data.email,
//     firstname: data.firstname,
//     lastname: data.lastname,
//     picture: data.picture,
//     provider: data.provider,
//     lastLoginMethod: data.lastLoginMethod,
//     lastLoginAt: data.lastLoginAt,
//   });

//   // Set HTTP-only cookies if accessToken exists
//   if (data.accessToken) {
//     setCookie("auth-token", data.accessToken, {
//       maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,

//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });

//     if (data.refreshToken) {
//       setCookie("refresh-token", data.refreshToken, {
//         maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,

//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         path: "/",
//       });
//     }
//   }
// };

// export const useGoogleLoginStore = create<TGoogleLoginState>((set) => ({
//   loading: false,
//   error: null,
//   isAuthenticated: false,
//   message: null,
//   role: null,
//   newUser: null,
//   email: null,
//   firstname: null,
//   lastname: null,
//   picture: null,
//   provider: null,
//   lastLoginMethod: null,
//   lastLoginAt: null,
//   setRole: (role: TUserRole) => set({ role: role }),
//   initialize: () => {
//     // Authentication state is determined by HTTP-only cookies
//     set({ isAuthenticated: true });
//   },

//   googleLogin: (rememberMe: boolean, usePopup: boolean = true) => {
//     console.log("Google Logged In");
//     set({ loading: true, error: null });
  
//     const oauthURL = API_AUTH_SOCIAL_GOOGLE_URL;
  
//     // Redirect mode (full page)
//     if (!usePopup) {
//       window.location.href = oauthURL;
//       return;
//     }
  
//     // Open popup
//     const popup = window.open(
//       oauthURL,
//       "google-oauth",
//       "width=500,height=600,noopener,noreferrer"
//     );
  
//     if (!popup) {
//       set({ loading: false, error: "Popup blocked by browser" });
//       return;
//     }
  
//     let messageListenerAttached = false;
  
//     const handleMessage = (ev: MessageEvent<TGoogleLoginResponse>) => {
//       if (ev.origin !== BACKEND_ORIGIN) return; // Security check
  
//       window.removeEventListener("message", handleMessage);
//       messageListenerAttached = false;
  
//       // Try closing popup (may fail due to COOP — harmless)
//       try {
//         popup.close();
//       } catch (_) {
//         console.debug("Popup close blocked by browser security policy");
//       }
  
//       FINISH_LOGIN(ev.data, rememberMe);
//     };
  
//     /**
//      * 🔒 Prevent message firing too early
//      * Wait until popup is fully loaded before listening.
//      */
//     const waitForPopup = setInterval(() => {
//       if (popup.closed) {
//         clearInterval(waitForPopup);
//         if (messageListenerAttached) {
//           window.removeEventListener("message", handleMessage);
//         }
//         set({ loading: false, error: "Popup closed before login" });
//         return;
//       }
  
//       // When popup leaves about:blank, the redirect page loaded
//       try {
//         if (popup.location.href !== "about:blank") {
//           if (!messageListenerAttached) {
//             window.addEventListener("message", handleMessage);
//             messageListenerAttached = true;
//           }
//           clearInterval(waitForPopup);
//         }
//       } catch {
//         // Popup still navigating (cross-origin), safe to ignore
//       }
//     }, 200);
//   },

//   clearToken: () => {
//     // Delete cookies with all possible options to ensure removal
//     deleteCookie("auth-token", { path: "/" });
//     deleteCookie("refresh-token", { path: "/" });

//     // Also try to delete without specifying options (fallback)
//     deleteCookie("auth-token");
//     deleteCookie("refresh-token");

//     // Clear local/session storage as well
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("auth-token");
//       localStorage.removeItem("refresh-token");
//       sessionStorage.removeItem("auth-token");
//       sessionStorage.removeItem("refresh-token");
//     }

//     useGetCurrentUserStore.getState().clearUser();
//     set({
//       loading: false,
//       error: null,
//       isAuthenticated: false,
//       message: null,
//       role: null,
//       newUser: null,
//       email: null,
//       firstname: null,
//       lastname: null,
//       picture: null,
//       provider: null,
//     });
//   },
// }));

import { create } from "zustand";
import { useGetCurrentUserStore } from "../../users/get-current-user.store";
import { API_AUTH_SOCIAL_GOOGLE_URL } from "@/utils/constants/apis/auth_url";
import { TUserRole } from "@/utils/types/role.type";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";
import { getCookie } from "cookies-next";

// Updated response type - NO TOKENS
export type TGoogleLoginResponse = {
  type: 'GOOGLE_AUTH_SUCCESS' | 'GOOGLE_AUTH_ERROR';
  error?: string;
  newUser?: boolean;
  user?: {
    email: string | null;
    firstname: string | null;
    lastname: string | null;
    picture: string | null;
    provider: string | null;
    role: string | null;
    lastLoginMethod: EAuthLoginMethod | null;
    lastLoginAt: string | null;
  };
};

export type TGoogleLoginState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  role: string | null;
  newUser: boolean | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  lastLoginMethod: EAuthLoginMethod | null;
  lastLoginAt: string | null;
  picture: string | null;
  provider: string | null;
  setRole: (role: TUserRole) => void;
  googleLogin: (rememberMe: boolean, usePopup?: boolean) => void;
  initialize: () => void;
  clearToken: () => void;
};

const BACKEND_ORIGIN = API_AUTH_SOCIAL_GOOGLE_URL.split("/social")[0];

const FINISH_LOGIN = (data: TGoogleLoginResponse) => {
  if (!data || data.type !== 'GOOGLE_AUTH_SUCCESS') {
    useGoogleLoginStore.setState({
      loading: false,
      error: data?.error || 'Authentication failed',
      isAuthenticated: false,
    });
    return;
  }

  // Cookies are already set by backend (httpOnly)
  // Just update the Zustand store with user info
  useGoogleLoginStore.setState({
    loading: false,
    isAuthenticated: true,
    message: 'Login successful',
    role: data.user?.role || null,
    newUser: data.newUser || false,
    email: data.user?.email || null,
    firstname: data.user?.firstname || null,
    lastname: data.user?.lastname || null,
    picture: data.user?.picture || null,
    provider: data.user?.provider || null,
    lastLoginMethod: data.user?.lastLoginMethod || null,
    lastLoginAt: data.user?.lastLoginAt || null,
    error: null,
  });
};

export const useGoogleLoginStore = create<TGoogleLoginState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  role: null,
  newUser: null,
  email: null,
  firstname: null,
  lastname: null,
  picture: null,
  provider: null,
  lastLoginMethod: null,
  lastLoginAt: null,
  
  setRole: (role: TUserRole) => set({ role: role }),
  
  initialize: () => {
    // Check if auth cookie exists (not httpOnly check)
    const rememberCookie = getCookie('auth-remember');
    set({ isAuthenticated: !!rememberCookie });
  },

  googleLogin: (rememberMe: boolean, usePopup: boolean = true) => {
    console.log("Initiating Google Login");
    set({ loading: true, error: null });
  
    // Add remember parameter to URL
    const oauthURL = `${API_AUTH_SOCIAL_GOOGLE_URL}?remember=${rememberMe}`;
  
    // Redirect mode (full page)
    if (!usePopup) {
      window.location.href = oauthURL;
      return;
    }
  
    // Open popup
    const popup = window.open(
      oauthURL,
      "google-oauth",
      "width=500,height=600,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes"
    );
  
    if (!popup) {
      set({ 
        loading: false, 
        error: "Popup blocked. Please allow popups for this site." 
      });
      return;
    }
  
    let messageReceived = false;
  
    const handleMessage = (ev: MessageEvent<TGoogleLoginResponse>) => {
      // Strict origin check
      if (ev.origin !== BACKEND_ORIGIN) {
        console.warn('Ignored message from unexpected origin:', ev.origin);
        return;
      }

      // Check message type
      if (!ev.data || !ev.data.type?.startsWith('GOOGLE_AUTH_')) {
        return;
      }
  
      messageReceived = true;
      window.removeEventListener("message", handleMessage);
      clearInterval(popupChecker);
  
      // Try closing popup
      try {
        if (popup && !popup.closed) {
          popup.close();
        }
      } catch (e) {
        console.debug("Popup close blocked:", e);
      }
  
      FINISH_LOGIN(ev.data);
    };
  
    // Listen for postMessage
    window.addEventListener("message", handleMessage);
  
    // Check if popup was closed manually
    const popupChecker = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupChecker);
        window.removeEventListener("message", handleMessage);
        
        if (!messageReceived) {
          set({ 
            loading: false, 
            error: "Login cancelled or popup closed" 
          });
        }
      }
    }, 500);
  },

  clearToken: () => {
    // Call backend logout endpoint to clear httpOnly cookies
    fetch(`${BACKEND_ORIGIN}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important: send cookies
    }).catch(console.error);

    // Clear any client-side data
    useGetCurrentUserStore.getState().clearUser();
    
    set({
      loading: false,
      error: null,
      isAuthenticated: false,
      message: null,
      role: null,
      newUser: null,
      email: null,
      firstname: null,
      lastname: null,
      picture: null,
      provider: null,
      lastLoginMethod: null,
      lastLoginAt: null,
    });
  },
}));