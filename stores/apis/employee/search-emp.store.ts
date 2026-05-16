import { isAxiosError, isCancel } from "axios";
import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_SEARCH_EMP_URL } from "@/utils/constants/apis/user-api/employee.api.constant";
import { IEmployee } from "@/utils/interfaces/user/employee.interface";
import { TAvailability } from "@/utils/types/user/availability.type";
import { TLocations } from "@/utils/types/user/location.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Search Employee Query Params ──────────────────────────────────────
type TSearchEmpQueryParams = {
  keyword?: string;
  location?: TLocations;
  careerScopes?: string[];
  jobType?: TAvailability;
  experienceLevel?: string;
  education?: string | string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

// ── Search Employee Options ────────────────────────────────────────
type TSearchEmpOptions = {
  /**
   * When true and the scoped query returns zero results, automatically
   * retries the same query without `careerScopes` so the user always sees
   * something. `isUsingFallback` is set to true in that case.
   */
  scopeFallback?: boolean;
};

// ── Search Employee API Response ──────────────────────────────────────
type TSearchEmployeeResponse = IEmployee[];

// ── Search Employee State ──────────────────────────────────────────────
type TSearchEmployeeState = {
  employees: TSearchEmployeeResponse | null;
  error: string | null;
  loading: boolean;
  /** True when results come from the broad fallback (no scope filter). */
  isUsingFallback: boolean;
  resetSearch: () => void;
  querySearchEmployee: (
    query: TSearchEmpQueryParams,
    options?: TSearchEmpOptions,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
// AbortController instance kept outside Zustand state (not serialisable)
let searchEmpAbortController: AbortController | null = null;

/** Build a URLSearchParams string from a query object. */
function buildQueryString(query: TSearchEmpQueryParams): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value.toString());
      }
    }
  });
  return params.toString();
}

export const useSearchEmployeeStore = create<TSearchEmployeeState>((set) => ({
  employees: null,
  loading: false,
  error: null,
  isUsingFallback: false,
  resetSearch: () => {
    searchEmpAbortController?.abort();
    searchEmpAbortController = null;
    set({ employees: null, loading: false, error: null, isUsingFallback: false });
  },
  querySearchEmployee: async (
    query: TSearchEmpQueryParams,
    options?: TSearchEmpOptions,
  ) => {
    // Cancel any in-flight request before starting a new one.
    // Capture to a local const so the fallback request uses the same signal
    // even if another call replaces the module-level ref while we await.
    searchEmpAbortController?.abort();
    const controller = new AbortController();
    searchEmpAbortController = controller;

    set({ loading: true, error: null, isUsingFallback: false });

    try {
      const url = `${API_SEARCH_EMP_URL}?${buildQueryString(query)}`;
      const response = await apiClient.get<TSearchEmployeeResponse>(url, {
        signal: controller.signal,
      });

      // ── Scope Fallback ─────────────────────────────────────────────
      // If the scoped query returned nothing, retry without the scope filter
      // so the user always sees results (similar names may not be indexed
      // identically in the DB join table).
      if (
        response.data.length === 0 &&
        options?.scopeFallback &&
        query.careerScopes &&
        query.careerScopes.length > 0
      ) {
        const { careerScopes: _omit, ...queryWithoutScopes } = query;
        const fallbackUrl = `${API_SEARCH_EMP_URL}?${buildQueryString(queryWithoutScopes)}`;
        const fallbackResponse = await apiClient.get<TSearchEmployeeResponse>(
          fallbackUrl,
          // Use the local ref — module-level may have been replaced by a
          // newer call between the two awaits.
          { signal: controller.signal },
        );
        set({
          employees: fallbackResponse.data,
          loading: false,
          error: null,
          isUsingFallback: true,
        });
        return;
      }

      set({ employees: response.data, loading: false, error: null, isUsingFallback: false });
    } catch (error) {
      // Ignore cancellation — a newer request is already in flight and will
      // resolve loading itself. resetSearch() handles the reset-only case.
      if (isCancel(error)) {
        return;
      }

      // The backend throws HTTP 404 when a query returns zero results.
      // This is not a real error — treat it as an empty result set so the
      // UI shows "no results found" rather than sticking on the skeleton.
      // Also trigger scopeFallback here so a scoped 404 retries without scopes.
      if (isAxiosError(error) && error.response?.status === 404) {
        if (
          options?.scopeFallback &&
          query.careerScopes &&
          query.careerScopes.length > 0
        ) {
          try {
            const { careerScopes: _omit, ...queryWithoutScopes } = query;
            const fallbackUrl = `${API_SEARCH_EMP_URL}?${buildQueryString(queryWithoutScopes)}`;
            const fallbackResponse = await apiClient.get<TSearchEmployeeResponse>(
              fallbackUrl,
              { signal: controller.signal },
            );
            set({
              employees: fallbackResponse.data,
              loading: false,
              error: null,
              isUsingFallback: true,
            });
          } catch (fallbackError) {
            if (isCancel(fallbackError)) return;
            // Fallback also found nothing — show empty gracefully
            set({ employees: [], loading: false, error: null, isUsingFallback: false });
          }
          return;
        }
        // No scopeFallback — resolve with an empty list
        set({ employees: [], loading: false, error: null, isUsingFallback: false });
        return;
      }

      set({
        error: extractApiErrorMessage(error, "Failed to search employee"),
        loading: false,
        employees: null,
        isUsingFallback: false,
      });
    }
  },
}));
