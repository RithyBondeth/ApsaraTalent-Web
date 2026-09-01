import { isAxiosError, isCancel } from "axios";
import apiClient from "@/lib/axios";
import { extractApiErrorMessage } from "@/stores/shared/api-error-message";
import { API_SEARCH_JOB_URL } from "@/utils/constants/apis/job.api.constant";
import { TLocations } from "@/utils/types/user/location.type";
import { create } from "zustand";

/* ---------------------------------- States --------------------------------- */
// ── Search Job Query Params ──────────────────────────────────────────────
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
  /** remote | on_site | hybrid | flexible */
  workMode?: string;
  postedDateFrom?: string;
  postedDateTo?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  excludeCompanyIds?: string[];
  /** Restore to this page on initial load (fetches restorePage * PAGE_SIZE items). */
  restorePage?: number;
};

// ── Search Job Response ──────────────────────────────────────────────
type TSearchJobResponse = {
  id?: string;
  title: string;
  description: string;
  type: string;
  /** Legacy free-text range; older postings have only this. */
  salary: string;
  // Decimal columns, so these arrive as strings over the wire.
  salaryMin?: number | string | null;
  salaryMax?: number | string | null;
  salaryCurrency?: string | null;
  workMode?: string | null;
  languagesRequired?: string[] | null;
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

// ── Search Job Paged Response ──────────────────────────────────────────
type TSearchJobPagedResponse = {
  data: TSearchJobResponse[];
  total: number;
  page: number;
  pageSize: number;
  isUsingFallback: boolean;
};

// ── Search Job State ──────────────────────────────────────────────────────
type TSearchJobState = {
  jobs: TSearchJobResponse[] | null;
  total: number;
  page: number;
  pageSize: number;
  isUsingFallback: boolean;
  error: string | null;
  loading: boolean;
  loadingMore: boolean;
  resetSearch: () => void;
  querySearchJobs: (query: TSearchJobQueryParams) => Promise<void>;
  loadMoreJobs: (query: TSearchJobQueryParams) => Promise<void>;
};
let searchJobAbortController: AbortController | null = null;

const PAGE_SIZE = 20;

function parseSearchJobResponse(value: unknown): TSearchJobPagedResponse {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as Partial<TSearchJobPagedResponse>).data)
  ) {
    throw new Error("Invalid job search response");
  }

  const response = value as Partial<TSearchJobPagedResponse>;
  const data = response.data as TSearchJobResponse[];

  return {
    data,
    total:
      typeof response.total === "number" && Number.isFinite(response.total)
        ? Math.max(0, response.total)
        : data.length,
    page:
      typeof response.page === "number" && response.page > 0
        ? response.page
        : 1,
    pageSize:
      typeof response.pageSize === "number" && response.pageSize > 0
        ? response.pageSize
        : PAGE_SIZE,
    isUsingFallback: response.isUsingFallback === true,
  };
}

// ── Build Query String ──────────────────────────────────────────────
function buildQueryString(
  query: TSearchJobQueryParams & { page?: number; pageSize?: number },
): string {
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

/* ---------------------------------- Store --------------------------------- */

export const useSearchJobStore = create<TSearchJobState>((set, get) => ({
  jobs: null,
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  isUsingFallback: false,
  error: null,
  loading: false,
  loadingMore: false,

  resetSearch: () => {
    searchJobAbortController?.abort();
    searchJobAbortController = null;
    set({
      jobs: null,
      total: 0,
      page: 1,
      isUsingFallback: false,
      error: null,
      loading: false,
      loadingMore: false,
    });
  },

  querySearchJobs: async (query) => {
    searchJobAbortController?.abort();
    const controller = new AbortController();
    searchJobAbortController = controller;

    set({
      loading: true,
      error: null,
      jobs: null,
      page: 1,
      isUsingFallback: false,
    });

    try {
      const effectivePage =
        (query.restorePage ?? 1) > 1 ? query.restorePage! : 1;
      const effectivePageSize =
        effectivePage > 1 ? effectivePage * PAGE_SIZE : PAGE_SIZE;
      const url = `${API_SEARCH_JOB_URL}?${buildQueryString({ ...query, page: 1, pageSize: effectivePageSize })}`;
      const response = await apiClient.get<TSearchJobPagedResponse>(url, {
        signal: controller.signal,
      });
      const { data, total, isUsingFallback } = parseSearchJobResponse(
        response.data,
      );
      set({
        jobs: data,
        total,
        page: effectivePage,
        pageSize: PAGE_SIZE,
        isUsingFallback,
        loading: false,
        error: null,
      });
    } catch (error) {
      if (isCancel(error)) return;
      if (isAxiosError(error) && error.response?.status === 404) {
        set({
          jobs: [],
          total: 0,
          loading: false,
          error: null,
          isUsingFallback: false,
        });
        return;
      }
      set({
        error: extractApiErrorMessage(error, "Failed to search jobs"),
        loading: false,
        jobs: null,
      });
    }
  },

  loadMoreJobs: async (query) => {
    const { page, pageSize, total, jobs, loadingMore, isUsingFallback } = get();
    if (loadingMore) return;
    if (jobs !== null && jobs.length >= total) return;

    const nextPage = page + 1;
    set({ loadingMore: true });

    // When page 1 fell back to a no-scope query, subsequent pages must also
    // run without scopes — otherwise the scoped query yields nothing and the
    // total (from the fallback) no longer matches what Load More can fetch.
    const effectiveQuery = isUsingFallback
      ? { ...query, careerScopes: undefined }
      : query;

    try {
      const url = `${API_SEARCH_JOB_URL}?${buildQueryString({ ...effectiveQuery, page: nextPage, pageSize })}`;
      const controller = new AbortController();
      const response = await apiClient.get<TSearchJobPagedResponse>(url, {
        signal: controller.signal,
      });
      const { data } = parseSearchJobResponse(response.data);
      set((s) => ({
        jobs: [...(s.jobs ?? []), ...data],
        page: nextPage,
        loadingMore: false,
      }));
    } catch (error) {
      if (isCancel(error)) return;
      set({ loadingMore: false });
    }
  },
}));
