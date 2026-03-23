import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";
import { useEffect, useMemo, useRef } from "react";

interface UseFetchOnceOptions {
  onEmployeeFetch?: (employeeId: string) => void;
  onCompanyFetch?: (companyId: string) => void;
  enabled?: boolean;
  cacheKey?: string; // Unique key per usage
}

interface UseFetchOnceReturn {
  isEmployee: boolean;
  isCompany: boolean;
  employeeId?: string;
  companyId?: string;
  currentUserId?: string;
  currentUser: IUser | null;
}

// Module-level cache that tracks: cacheKey + userId
const fetchCache = new Map<string, Set<string>>();

export function useFetchOnce(
  options: UseFetchOnceOptions = {},
): UseFetchOnceReturn {
  const {
    onEmployeeFetch,
    onCompanyFetch,
    enabled = true,
    cacheKey = "default",
  } = options;

  const currentUser = useGetCurrentUserStore((s) => s.user);
  const lastUserIdRef = useRef<string | null>(null);

  // Stable refs for callbacks — prevents the effect from re-running when
  // parent re-renders create new inline function references
  const onEmployeeFetchRef = useRef(onEmployeeFetch);
  const onCompanyFetchRef = useRef(onCompanyFetch);
  useEffect(() => {
    onEmployeeFetchRef.current = onEmployeeFetch;
    onCompanyFetchRef.current = onCompanyFetch;
  });

  const userData = useMemo(() => {
    const employee =
      currentUser?.role === "employee" ? currentUser.employee : null;
    const company =
      currentUser?.role === "company" ? currentUser.company : null;

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

  // Initialize cache for this cacheKey if it doesn't exist
  if (!fetchCache.has(cacheKey)) {
    fetchCache.set(cacheKey, new Set<string>());
  }

  // Stable ref to the cache Set — avoids the Set reference being a dep
  const cacheRef = useRef(fetchCache.get(cacheKey)!);
  useEffect(() => {
    cacheRef.current = fetchCache.get(cacheKey) ?? new Set();
  }, [cacheKey]);

  // Clear cache entry when user changes
  useEffect(() => {
    if (userData.currentUserId !== lastUserIdRef.current) {
      if (lastUserIdRef.current) {
        cacheRef.current.delete(lastUserIdRef.current);
      }
      lastUserIdRef.current = userData.currentUserId ?? null;
    }
  }, [userData.currentUserId]);

  useEffect(() => {
    if (!enabled || !userData.currentUserId) return;

    // Check if already fetched for THIS specific cache key + user
    if (cacheRef.current.has(userData.currentUserId)) {
      return;
    }

    // Mark as fetched BEFORE calling (prevents race conditions)
    cacheRef.current.add(userData.currentUserId);

    if (
      userData.isEmployee &&
      userData.employeeId &&
      onEmployeeFetchRef.current
    ) {
      onEmployeeFetchRef.current(userData.employeeId);
    }

    if (userData.isCompany && userData.companyId && onCompanyFetchRef.current) {
      onCompanyFetchRef.current(userData.companyId);
    }
  }, [
    enabled,
    userData.currentUserId,
    userData.isEmployee,
    userData.isCompany,
    userData.employeeId,
    userData.companyId,
  ]);

  return userData;
}
