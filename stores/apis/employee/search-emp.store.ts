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
  /** Match candidates holding ANY of these skills. */
  skills?: string[];
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  excludeEmployeeIds?: string[];
  /** Restore to this page on initial load (fetches restorePage * PAGE_SIZE items). */
  restorePage?: number;
};

// ── Search Employee Paged Response ──────────────────────────────────────
type TSearchEmployeePagedResponse = {
  data: IEmployee[];
  total: number;
  page: number;
  pageSize: number;
  isUsingFallback: boolean;
};
// ── Search Employee State ───────────────────────────────────────────────
type TSearchEmployeeState = {
  employees: IEmployee[] | null;
  total: number;
  page: number;
  pageSize: number;
  isUsingFallback: boolean;
  error: string | null;
  loading: boolean;
  loadingMore: boolean;
  resetSearch: () => void;
  querySearchEmployee: (query: TSearchEmpQueryParams) => Promise<void>;
  loadMoreEmployees: (query: TSearchEmpQueryParams) => Promise<void>;
};

let searchEmpAbortController: AbortController | null = null;

const PAGE_SIZE = 20;

function parseSearchEmployeeResponse(
  value: unknown,
): TSearchEmployeePagedResponse {
  if (
    !value ||
    typeof value !== "object" ||
    !Array.isArray((value as Partial<TSearchEmployeePagedResponse>).data)
  ) {
    throw new Error("Invalid employee search response");
  }

  const response = value as Partial<TSearchEmployeePagedResponse>;
  const data = response.data as IEmployee[];

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
  query: TSearchEmpQueryParams & { page?: number; pageSize?: number },
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
export const useSearchEmployeeStore = create<TSearchEmployeeState>(
  (set, get) => ({
    employees: null,
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    isUsingFallback: false,
    error: null,
    loading: false,
    loadingMore: false,

    resetSearch: () => {
      searchEmpAbortController?.abort();
      searchEmpAbortController = null;
      set({
        employees: null,
        total: 0,
        page: 1,
        isUsingFallback: false,
        error: null,
        loading: false,
        loadingMore: false,
      });
    },

    querySearchEmployee: async (query) => {
      searchEmpAbortController?.abort();
      const controller = new AbortController();
      searchEmpAbortController = controller;

      set({
        loading: true,
        error: null,
        employees: null,
        page: 1,
        isUsingFallback: false,
      });

      try {
        const effectivePage =
          (query.restorePage ?? 1) > 1 ? query.restorePage! : 1;
        const effectivePageSize =
          effectivePage > 1 ? effectivePage * PAGE_SIZE : PAGE_SIZE;
        const url = `${API_SEARCH_EMP_URL}?${buildQueryString({ ...query, page: 1, pageSize: effectivePageSize })}`;
        const response = await apiClient.get<TSearchEmployeePagedResponse>(
          url,
          {
            signal: controller.signal,
          },
        );
        const { data, total, isUsingFallback } = parseSearchEmployeeResponse(
          response.data,
        );
        set({
          employees: data,
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
            employees: [],
            total: 0,
            loading: false,
            error: null,
            isUsingFallback: false,
          });
          return;
        }
        set({
          error: extractApiErrorMessage(error, "Failed to search employee"),
          loading: false,
          employees: null,
        });
      }
    },

    loadMoreEmployees: async (query) => {
      const { page, pageSize, total, employees, loadingMore, isUsingFallback } =
        get();
      if (loadingMore) return;
      if (employees !== null && employees.length >= total) return;

      const nextPage = page + 1;
      set({ loadingMore: true });

      // When page 1 fell back to a no-scope query, subsequent pages must also
      // run without scopes — otherwise the scoped query yields nothing and the
      // total (from the fallback) no longer matches what Load More can fetch.
      const effectiveQuery = isUsingFallback
        ? { ...query, careerScopes: undefined }
        : query;

      try {
        const url = `${API_SEARCH_EMP_URL}?${buildQueryString({ ...effectiveQuery, page: nextPage, pageSize })}`;
        const controller = new AbortController();
        const response = await apiClient.get<TSearchEmployeePagedResponse>(
          url,
          {
            signal: controller.signal,
          },
        );
        const { data } = parseSearchEmployeeResponse(response.data);
        set((s) => ({
          employees: [...(s.employees ?? []), ...data],
          page: nextPage,
          loadingMore: false,
        }));
      } catch (error) {
        if (isCancel(error)) return;
        set({ loadingMore: false });
      }
    },
  }),
);
