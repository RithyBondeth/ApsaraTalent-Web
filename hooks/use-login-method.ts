import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { getCurrentUserLoginMethod, TLoginMethod } from "@/utils/auth/get-login-method";

/**
 * Custom hook to get the current user's login method
 * @returns Object containing login method information
 */
export const useLoginMethod = () => {
  const { user } = useGetCurrentUserStore();
  
  return getCurrentUserLoginMethod(user);
};

/**
 * Custom hook to check if current user used a specific login method
 * @param method - The login method to check
 * @returns True if the user used the specified login method
 */
export const useIsLoginMethod = (method: TLoginMethod): boolean => {
  const { method: userMethod } = useLoginMethod();
  return userMethod === method;
};