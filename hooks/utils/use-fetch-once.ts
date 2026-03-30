import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { IUser } from "@/utils/interfaces/user";
import { useEffect, useMemo, useRef } from "react";

/* ----------------------------------- Types ---------------------------------- */
interface UseFetchOnceOptions {
  onEmployeeFetch?: (employeeId: string) => void;
  onCompanyFetch?: (companyId: string) => void;
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

  /* --------------------------------- All States -------------------------------- */
  const currentUser = useGetCurrentUserStore((s) => s.user);
  const lastUserIdRef = useRef<string | null>(null);

  const onEmployeeFetchRef = useRef(onEmployeeFetch);
  const onCompanyFetchRef = useRef(onCompanyFetch);

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

  const cacheEntry = useMemo(() => {
    if (!fetchCache.has(cacheKey)) {
      fetchCache.set(cacheKey, new Set<string>());
    }

    return fetchCache.get(cacheKey)!;
  }, [cacheKey]);

  /* ---------------------------------- Effects --------------------------------- */
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

    cacheEntry.add(userData.currentUserId);

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
    cacheEntry,
    enabled,
    userData.currentUserId,
    userData.isEmployee,
    userData.isCompany,
    userData.employeeId,
    userData.companyId,
  ]);

  /* ---------------------------------- Return ---------------------------------- */
  return userData;
}
