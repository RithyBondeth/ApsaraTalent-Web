// import { useEffect, useRef, useMemo } from "react";
// import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
// import { IUser } from "@/utils/interfaces/user-interface/user.interface";

// interface UseFetchOnceOptions {
//   onEmployeeFetch?: (employeeId: string) => void;
//   onCompanyFetch?: (companyId: string) => void;
//   enabled?: boolean;
// }

// interface UseFetchOnceReturn {
//   isEmployee: boolean;
//   isCompany: boolean;
//   employeeId?: string;
//   companyId?: string;
//   currentUserId?: string;
//   currentUser: IUser | null;
// }

// export function useFetchOnce(
//   options: UseFetchOnceOptions = {}
// ): UseFetchOnceReturn {
//   const { onEmployeeFetch, onCompanyFetch, enabled = true } = options;

//   const currentUser = useGetCurrentUserStore((s) => s.user);

//   // 🔒 Track last fetched user ID (Strict Mode safe)
//   const fetchedUserIdRef = useRef<string | null>(null);

//   const userData = useMemo(() => {
//     const employee = currentUser?.role === "employee" ? currentUser.employee : null;
//     const company = currentUser?.role === "company" ? currentUser.company : null;

//     const currentUserId = employee?.id ?? company?.id;

//     return {
//       isEmployee: !!employee,
//       isCompany: !!company,
//       employeeId: employee?.id,
//       companyId: company?.id,
//       currentUserId,
//       currentUser,
//     };
//   }, [currentUser]);

//   useEffect(() => {
//     if (!enabled || !userData.currentUserId) return;

//     // ✅ Prevent duplicate calls (even in Strict Mode)
//     if (fetchedUserIdRef.current === userData.currentUserId) return;
//     fetchedUserIdRef.current = userData.currentUserId;

//     if (userData.isEmployee && userData.employeeId && onEmployeeFetch) {
//       onEmployeeFetch(userData.employeeId);
//     }

//     if (userData.isCompany && userData.companyId && onCompanyFetch) {
//       onCompanyFetch(userData.companyId);
//     }
//   }, [
//     enabled,
//     userData.currentUserId,
//     userData.isEmployee,
//     userData.isCompany,
//     userData.employeeId,
//     userData.companyId,
//     onEmployeeFetch,
//     onCompanyFetch,
//   ]);

//   return userData;
// }

import { useEffect, useRef, useMemo } from "react";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { IUser } from "@/utils/interfaces/user-interface/user.interface";

interface UseFetchOnceOptions {
  onEmployeeFetch?: (employeeId: string) => void;
  onCompanyFetch?: (companyId: string) => void;
  enabled?: boolean;
  cacheKey?: string; // ✅ New: Unique key per usage
}

interface UseFetchOnceReturn {
  isEmployee: boolean;
  isCompany: boolean;
  employeeId?: string;
  companyId?: string;
  currentUserId?: string;
  currentUser: IUser | null;
}

// ✅ Module-level cache that tracks: cacheKey + userId
const fetchCache = new Map<string, Set<string>>();

export function useFetchOnce(
  options: UseFetchOnceOptions = {}
): UseFetchOnceReturn {
  const { onEmployeeFetch, onCompanyFetch, enabled = true, cacheKey = "default" } = options;

  const currentUser = useGetCurrentUserStore((s) => s.user);
  const lastUserIdRef = useRef<string | null>(null);

  const userData = useMemo(() => {
    const employee = currentUser?.role === "employee" ? currentUser.employee : null;
    const company = currentUser?.role === "company" ? currentUser.company : null;

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

  const cache = fetchCache.get(cacheKey)!;

  // Clear cache when user changes
  useEffect(() => {
    if (userData.currentUserId !== lastUserIdRef.current) {
      if (lastUserIdRef.current) {
        cache.delete(lastUserIdRef.current);
      }
      lastUserIdRef.current = userData.currentUserId ?? null;
    }
  }, [userData.currentUserId, cache]);

  useEffect(() => {
    if (!enabled || !userData.currentUserId) return;

    // ✅ Check if already fetched for THIS specific cache key + user
    if (cache.has(userData.currentUserId)) {
      return;
    }

    // Mark as fetched BEFORE calling (prevents race conditions)
    cache.add(userData.currentUserId);

    if (userData.isEmployee && userData.employeeId && onEmployeeFetch) {
      onEmployeeFetch(userData.employeeId);
    }

    if (userData.isCompany && userData.companyId && onCompanyFetch) {
      onCompanyFetch(userData.companyId);
    }
  }, [
    enabled,
    userData.currentUserId,
    userData.isEmployee,
    userData.isCompany,
    userData.employeeId,
    userData.companyId,
    onEmployeeFetch,
    onCompanyFetch,
    cache,
  ]);

  return userData;
}