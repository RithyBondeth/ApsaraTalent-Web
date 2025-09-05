"use client";

import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { EAuthLoginMethod } from "@/utils/constants/auth.constant";

export const useLoginMethod = () => {
  const { user } = useGetCurrentUserStore();

  const getLoginMethodLabel = (method: EAuthLoginMethod) => {
    switch (method) {
      case EAuthLoginMethod.EMAIL_PASSWORD:
        return "Email & Password";
      case EAuthLoginMethod.PHONE_OTP:
        return "Phone OTP";
      case EAuthLoginMethod.GOOGLE:
        return "Google";
      case EAuthLoginMethod.FACEBOOK:
        return "Facebook";
      case EAuthLoginMethod.LINKEDIN:
        return "LinkedIn";
      case EAuthLoginMethod.GITHUB:
        return "GitHub";
      default:
        return "Unknown";
    }
  };

  return {
    loginMethod: user?.lastLoginMethod || null,
    loginMethodLabel: user?.lastLoginMethod ? getLoginMethodLabel(user.lastLoginMethod) : null,
    hasLoginMethod: !!user?.lastLoginMethod,
  };
};