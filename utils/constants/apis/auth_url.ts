import { API_BASE_URL } from "./base_url";

export const API_AUTH_URL = API_BASE_URL + "/auth";
export const API_AUTH_LOGIN_URL = API_AUTH_URL + "/login";
export const API_AUTH_SIGNUP_URL = {
    COMPANY: API_AUTH_URL + "/register-company",
    EMPLOYEE: API_AUTH_URL + "/register-employee"
}
export const API_AUTH_FORGOT_PASSWORD_URL = API_AUTH_URL + "/forgot-password";
export const API_AUTH_RESET_PASSWORD_URL = (token: string) => `${API_AUTH_URL}/reset-password/${token}`;
export const API_AUTH_VERIFY_EMAIL_URL = (emailVerificationToken: string) => `${API_AUTH_URL}/verify-email/${emailVerificationToken}`;

export const API_AUTH_VERIFY_OTP_URL = API_AUTH_URL + "/verify-otp";
export const API_AUTH_LOGIN_OTP_URL = API_AUTH_URL + "/login-otp";

export const API_AUTH_SOCIAL_FACEBOOK_URL = API_BASE_URL + "/social/google/callback";
