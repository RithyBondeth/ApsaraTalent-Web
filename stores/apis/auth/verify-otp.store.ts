import { API_AUTH_VERIFY_OTP_URL } from "@/utils/constants/apis/auth_url";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next";
import { create } from "zustand";
import { useGetCurrentUserStore } from "../users/get-current-user.store";

type TVerifyOTPResponse = {
  message: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  
};

type TVerifyOTPStoreState = {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string | null;
  verifyOtp: (phone: string, otpCode: string, rememberMe: boolean) => Promise<IUser>;
  clearToken: () => void;
  initialize: () => void;
};

export const useVerifyOTPStore = create<TVerifyOTPStoreState>((set) => ({
  loading: false,
  error: null,
  isAuthenticated: false,
  message: null,
  initialize: () => {
    // Authentication state is determined by HTTP-only cookies
    set({ isAuthenticated: true });
  },
  verifyOtp: async (phone: string, otpCode: string, rememberMe: boolean) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post<TVerifyOTPResponse & { user: IUser }>(
        API_AUTH_VERIFY_OTP_URL,
        {
          phone: phone,
          otp: otpCode,
        }
      );

      set({
        loading: false,
        isAuthenticated: !!response.data.accessToken,
        message: response.data.message,
        error: null
      });
      setCookie('auth-token', response.data.accessToken, {
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined, // 30 days for "remember me"
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      
      if (response.data.refreshToken) {
        setCookie('refresh-token', response.data.refreshToken, {
          maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/'
        });
      }
      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message instanceof Array
            ? error.response.data.message.join(", ")
            : error.response?.data?.message || error.message;

        set({ loading: false, error: errorMessage, isAuthenticated: false });
        throw new Error(errorMessage);
      } else {
        set({
          loading: false,
          error: "An error occurred while verifying otp.",
          message: "An error occurred while verifying otp.",
          isAuthenticated: false,
        });
        throw new Error("An error occurred while verifying otp.");
      }
    }
  },
  clearToken: () => {
    // Delete cookies with all possible options to ensure removal
    deleteCookie('auth-token', { path: '/' });
    deleteCookie('refresh-token', { path: '/' });
    
    // Also try to delete without specifying options (fallback)
    deleteCookie('auth-token');
    deleteCookie('refresh-token');
    
    // Clear local/session storage as well
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh-token');
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('refresh-token');
    }
    
    useGetCurrentUserStore.getState().clearUser();
    set({
      loading: false,
      error: null,
      isAuthenticated: false,
      message: null,
    });
  },
}));