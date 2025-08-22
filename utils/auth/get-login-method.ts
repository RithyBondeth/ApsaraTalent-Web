import { IUser } from "../interfaces/user-interface/user.interface";

export type TLoginMethod =
  | "facebook"
  | "linkedin"
  | "google"
  | "github"
  | "normalLogin"
  | "otpLogin"
  | "unknown";

export const getLoginMethod = (user: IUser | null): TLoginMethod => {
  if (!user) {
    return "unknown";
  }

  // Check for social login methods
  if (user.facebookId) {
    return "facebook";
  }

  if (user.googleId) {
    return "google";
  }

  if (user.linkedinId) {
    return "linkedin";
  }

  if (user.githubId) {
    return "github";
  }

  // Check for OTP login (phone number without social IDs)
  if (user.phone && !user.email) {
    return "otpLogin";
  }

  // Check for normal email/password login
  if (
    user.email &&
    !user.facebookId &&
    !user.googleId &&
    !user.linkedinId &&
    !user.githubId
  ) {
    return "normalLogin";
  }

  return "unknown";
};

export const getLoginMethodLabel = (loginMethod: TLoginMethod): string => {
  const labels: Record<TLoginMethod, string> = {
    facebook: "Facebook",
    linkedin: "LinkedIn",
    google: "Google",
    github: "GitHub",
    normalLogin: "Email & Password",
    otpLogin: "Phone Number (OTP)",
    unknown: "Unknown",
  };

  return labels[loginMethod];
};

export const isSocialLogin = (loginMethod: TLoginMethod): boolean => {
  return ["facebook", "linkedin", "google", "github"].includes(loginMethod);
};

export const getCurrentUserLoginMethod = (user: IUser | null) => {
  const method = getLoginMethod(user);
  const label = getLoginMethodLabel(method);
  const isSocial = isSocialLogin(method);

  return {
    method,
    label,
    isSocial,
    isOTP: method === "otpLogin",
    isNormal: method === "normalLogin",
  };
};
