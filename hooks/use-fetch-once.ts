import { useEffect, useRef, useMemo } from "react";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";

/**
 * Custom hook to fetch data only once per user session
 * Prevents duplicate API calls and handles user changes
 * 
 * @example
 * ```tsx
 * const { isEmployee, isCompany, employeeId, companyId } = useFetchOnce({
 *   onEmployeeFetch: (id) => fetchEmployeeData(id),
 *   onCompanyFetch: (id) => fetchCompanyData(id),
 * });
 * ```
 */
interface UseFetchOnceOptions {
  onEmployeeFetch?: (employeeId: string) => void;
  onCompanyFetch?: (companyId: string) => void;
  enabled?: boolean; // Optional flag to enable/disable fetching
}

interface UseFetchOnceReturn {
  isEmployee: boolean;
  isCompany: boolean;
  employeeId: string | undefined;
  companyId: string | undefined;
  currentUserId: string | undefined;
  currentUser: ReturnType<typeof useGetCurrentUserStore>;
}

export function useFetchOnce(options: UseFetchOnceOptions = {}): UseFetchOnceReturn {
  const { onEmployeeFetch, onCompanyFetch, enabled = true } = options;

  // Refs to track if data has been fetched
  const hasFetchedRef = useRef(false);
  const lastUserIdRef = useRef<string | undefined>(undefined);
 
  // Get current user
  const currentUser = useGetCurrentUserStore((state) => state.user);

  // Memoized user data
  const userData = useMemo(() => {
    const employee = currentUser?.role === "employee" && currentUser.employee;
    const company = currentUser?.role === "company" && currentUser.company;

    return {
      isEmployee: !!employee,
      isCompany: !!company,
      employeeId: employee ? currentUser.employee?.id : undefined,
      companyId: company ? currentUser.company?.id : undefined,
      currentUserId: employee
        ? currentUser.employee?.id
        : company
        ? currentUser.company?.id
        : undefined,
      currentUser,
    };
  }, [currentUser]);

  // Reset fetch flag when user changes
  useEffect(() => {
    if (userData.currentUserId !== lastUserIdRef.current) {
      hasFetchedRef.current = false;
      lastUserIdRef.current = userData.currentUserId;
    }
  }, [userData.currentUserId]);

  // Fetch data (only once per user)
  useEffect(() => {
    if (!enabled || !currentUser || hasFetchedRef.current) return;

    if (userData.isEmployee && userData.employeeId && onEmployeeFetch) {
      onEmployeeFetch(userData.employeeId);
      hasFetchedRef.current = true;
    } else if (userData.isCompany && userData.companyId && onCompanyFetch) {
      onCompanyFetch(userData.companyId);
      hasFetchedRef.current = true;
    }
  }, [
    enabled,
    currentUser,
    userData.isEmployee,
    userData.isCompany,
    userData.employeeId,
    userData.companyId,
    onEmployeeFetch,
    onCompanyFetch,
  ]);

  return userData;
}

/**
 * Alternative: Simple hook that just returns user data without auto-fetching
 * Use this when you want manual control over when to fetch
 * 
 * @example
 * ```tsx
 * const { isEmployee, employeeId } = useUserData();
 * 
 * useEffect(() => {
 *   if (isEmployee && employeeId) {
 *     fetchData(employeeId);
 *   }
 * }, [isEmployee, employeeId]);
 * ```
 */
export function useUserData(): Omit<UseFetchOnceReturn, "currentUser"> & {
  currentUser: ReturnType<typeof useGetCurrentUserStore>;
} {
  const currentUser = useGetCurrentUserStore((state) => state.user);

  return useMemo(() => {
    const employee = currentUser?.role === "employee" && currentUser.employee;
    const company = currentUser?.role === "company" && currentUser.company;

    return {
      isEmployee: !!employee,
      isCompany: !!company,
      employeeId: employee ? currentUser.employee?.id : undefined,
      companyId: company ? currentUser.company?.id : undefined,
      currentUserId: employee
        ? currentUser.employee?.id
        : company
        ? currentUser.company?.id
        : undefined,
      currentUser,
    };
  }, [currentUser]);
}