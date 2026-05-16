import { isAxiosError, isCancel } from "axios";
import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_SEARCH_JOB_URL } from "@/utils/constants/apis/job.api.constant";
import { TLocations } from "@/utils/types/user/location.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Search Job Query Params ────────────────────────────────────────
type TSearchJobQueryParams = {
  keyword?: string;
  location?: string;
  jobType?: string;
  careerScopes?: string[];
  companySizeMin?: number;
  companySizeMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  educationRequired?: string | string[];
  postedDateFrom?: string;
  postedDateTo?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
};

// ── Search Job Options ─────────────────────────────────────────────
type TSearchJobOptions = {
  /**
   * When true and the scoped query returns zero results, automatically
   * retries the same query without `careerScopes` so the user always sees
   * something. `isUsingFallback` is set to true in that case.
   */
  scopeFallback?: boolean;
};

// ── Search Job API Response ────────────────────────────────────────
type TSearchJobResponse = {
  id?: string;
  title: string;
  description: string;
  type: string;
  salary: string;
  experience: string;
  education: string;
  skills: string[];
  deadlineDate?: string;
  postedDate: string;
  company: {
    id?: string;
    name: string;
    avatar?: string;
    companySize: number;
    industry: string;
    location: TLocations;
    user: { id: string };
  };
};

// ── Search Job State ────────────────────────────────────────────────
type TSearchJobState = {
  jobs: TSearchJobResponse[] | null;
  error: string | null;
  loading: boolean;
  /** True when results come from the broad fallback (no scope filter). */
  isUsingFallback: boolean;
  resetSearch: () => void;
  querySearchJobs: (
    query: TSearchJobQueryParams,
    options?: TSearchJobOptions,
  ) => Promise<void>;
};

/* ---------------------------------- Store --------------------------------- */
// AbortController instance kept outside Zustand state (not serialisable)
let searchJobAbortController: AbortController | null = null;

/** Build a URLSearchParams string from a query object. */
function buildQueryString(query: TSearchJobQueryParams): string {
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

export const useSearchJobStore = create<TSearchJobState>((set) => ({
  loading: false,
  error: null,
  jobs: null,
  isUsingFallback: false,
  resetSearch: () => {
    searchJobAbortController?.abort();
    searchJobAbortController = null;
    set({ jobs: null, loading: false, error: null, isUsingFallback: false });
  },
  querySearchJobs: async (
    query: TSearchJobQueryParams,
    options?: TSearchJobOptions,
  ) => {
    // Cancel any in-flight request before starting a new one.
    // Capture to a local const so the fallback request uses the same signal
    // even if another call replaces the module-level ref while we await.
    searchJobAbortController?.abort();
    const controller = new AbortController();
    searchJobAbortController = controller;

    set({ loading: true, error: null, isUsingFallback: false });

    try {
      const url = `${API_SEARCH_JOB_URL}?${buildQueryString(query)}`;
      const response = await apiClient.get<TSearchJobResponse[]>(url, {
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
        const fallbackUrl = `${API_SEARCH_JOB_URL}?${buildQueryString(queryWithoutScopes)}`;
        const fallbackResponse = await apiClient.get<TSearchJobResponse[]>(
          fallbackUrl,
          // Use the local ref — module-level may have been replaced by a
          // newer call between the two awaits.
          { signal: controller.signal },
        );
        set({
          jobs: fallbackResponse.data,
          loading: false,
          error: null,
          isUsingFallback: true,
        });
        return;
      }

      set({ jobs: response.data, loading: false, error: null, isUsingFallback: false });
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
            const fallbackUrl = `${API_SEARCH_JOB_URL}?${buildQueryString(queryWithoutScopes)}`;
            const fallbackResponse = await apiClient.get<TSearchJobResponse[]>(
              fallbackUrl,
              { signal: controller.signal },
            );
            set({
              jobs: fallbackResponse.data,
              loading: false,
              error: null,
              isUsingFallback: true,
            });
          } catch (fallbackError) {
            if (isCancel(fallbackError)) return;
            // Fallback also found nothing — show empty gracefully
            set({ jobs: [], loading: false, error: null, isUsingFallback: false });
          }
          return;
        }
        // No scopeFallback — resolve with an empty list
        set({ jobs: [], loading: false, error: null, isUsingFallback: false });
        return;
      }

      set({
        error: extractApiErrorMessage(error, "Failed to search jobs"),
        loading: false,
        jobs: null,
        isUsingFallback: false,
      });
    }
  },
}));
