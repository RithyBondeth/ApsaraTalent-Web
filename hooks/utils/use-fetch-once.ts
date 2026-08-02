import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { USER_ROLE } from "@/utils/constants/auth.constant";
import { IUser } from "@/utils/interfaces/user/user.interface";
import { useEffect, useMemo, useRef } from "react";

/* ---------------------------------- Usage ----------------------------------- */
/**
 * Fires role-aware profile fetch callbacks exactly once per user session,
 * deduplicating across multiple mounts via an in-memory cache.
 *
 * Usage:
 *   const { isEmployee, isCompany, employeeId, companyId, currentUser } =
 *     useFetchOnce({
 *       onEmployeeFetch: (id) => fetchEmployeeProfile(id),
 *       onCompanyFetch:  (id) => fetchCompanyProfile(id),
 *       enabled: true,       // default — set false to pause fetching
 *       cacheKey: "sidebar", // use different keys to fetch on separate mounts
 *     });
 *
 *   // Returned booleans / IDs reflect the current user's role.
 */

/* ----------------------------------- Types ---------------------------------- */
interface UseFetchOnceOptions {
  onEmployeeFetch?: (employeeId: string) => void | Promise<unknown>;
  onCompanyFetch?: (companyId: string) => void | Promise<unknown>;
  enabled?: boolean;
  cacheKey?: string;
}

interface UseFetchOnceReturn {
  isEmployee: boolean;
  isCompany: boolean;
  employeeId?: string;
  companyId?: string;
  currentUserId?: string;
  currentUser: IUser | null;
}

/* ----------------------------------- Utils ---------------------------------- */
const fetchCache = new Map<string, Set<string>>();

/* ----------------------------------- Hook ----------------------------------- */
export function useFetchOnce(
  options: UseFetchOnceOptions = {},
): UseFetchOnceReturn {
  const {
    onEmployeeFetch,
    onCompanyFetch,
    enabled = true,
    cacheKey = "default",
  } = options;

  /* -------------------------------- All States -------------------------------- */
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const lastUserIdRef = useRef<string | null>(null);

  const onEmployeeFetchRef = useRef(onEmployeeFetch);
  const onCompanyFetchRef = useRef(onCompanyFetch);

  const userData = useMemo(() => {
    const employee =
      currentUser?.role === USER_ROLE.EMPLOYEE ? currentUser.employee : null;
    const company =
      currentUser?.role === USER_ROLE.COMPANY ? currentUser.company : null;

    const currentUserId = employee?.id ?? company?.id;

    return {
      isEmployee: !!employee,
      isCompany: !!company,
      employeeId: employee?.id,
      companyId: company?.id,
      currentUserId,
      currentUser,
    };
  }, [currentUser]);

  const cacheEntry = useMemo(() => {
    if (!fetchCache.has(cacheKey)) {
      fetchCache.set(cacheKey, new Set<string>());
    }

    return fetchCache.get(cacheKey)!;
  }, [cacheKey]);

  /* --------------------------------- Effects ---------------------------------- */
  // Keep callback refs fresh without forcing the fetch effect to rerun
  // whenever parent components recreate inline callbacks.
  useEffect(() => {
    onEmployeeFetchRef.current = onEmployeeFetch;
    onCompanyFetchRef.current = onCompanyFetch;
  }, [onEmployeeFetch, onCompanyFetch]);

  useEffect(() => {
    if (userData.currentUserId !== lastUserIdRef.current) {
      if (lastUserIdRef.current) {
        cacheEntry.delete(lastUserIdRef.current);
      }

      lastUserIdRef.current = userData.currentUserId ?? null;
    }
  }, [cacheEntry, userData.currentUserId]);

  useEffect(() => {
    if (!enabled || !userData.currentUserId) {
      return;
    }

    if (cacheEntry.has(userData.currentUserId)) {
      return;
    }

    let request: void | Promise<unknown> = undefined;
    let invoked = false;
    if (
      userData.isEmployee &&
      userData.employeeId &&
      onEmployeeFetchRef.current
    ) {
      invoked = true;
      request = onEmployeeFetchRef.current(userData.employeeId);
    }

    if (userData.isCompany && userData.companyId && onCompanyFetchRef.current) {
      invoked = true;
      request = onCompanyFetchRef.current(userData.companyId);
    }

    // Do not mark a missing callback as fetched. If an async callback rejects,
    // allow a later mount to retry instead of permanently suppressing it.
    if (!invoked) {
      return;
    }

    cacheEntry.add(userData.currentUserId);
    if (request !== undefined) {
      void Promise.resolve(request).catch(() => {
        cacheEntry.delete(userData.currentUserId!);
      });
    }
  }, [
    cacheEntry,
    enabled,
    userData.currentUserId,
    userData.isEmployee,
    userData.isCompany,
    userData.employeeId,
    userData.companyId,
  ]);
  return userData;
}
