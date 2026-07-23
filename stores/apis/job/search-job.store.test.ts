import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearchJobStore } from "./search-job.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("job search store", () => {
  beforeEach(() => {
    axiosMocks.get.mockReset();
    useSearchJobStore.getState().resetSearch();
  });

  it("searches, appends the next page, and resets jobs", async () => {
    const firstPage = [{ id: "job-1", title: "Frontend Engineer" }];
    const nextPage = [{ id: "job-2", title: "Backend Engineer" }];
    axiosMocks.get
      .mockResolvedValueOnce({
        data: { data: firstPage, total: 2, page: 1, pageSize: 20, isUsingFallback: false },
      })
      .mockResolvedValueOnce({
        data: { data: nextPage, total: 2, page: 2, pageSize: 20, isUsingFallback: false },
      });

    await useSearchJobStore.getState().querySearchJobs({
      keyword: "engineer",
      careerScopes: ["software"],
      salaryMin: 1000,
    });
    await useSearchJobStore.getState().loadMoreJobs({ keyword: "engineer" });

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("keyword=engineer");
    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("salaryMin=1000");
    expect(axiosMocks.get.mock.calls[1]?.[0]).toContain("page=2");
    expect(useSearchJobStore.getState()).toMatchObject({
      jobs: [...firstPage, ...nextPage],
      total: 2,
      page: 2,
      loading: false,
      loadingMore: false,
    });

    useSearchJobStore.getState().resetSearch();
    expect(useSearchJobStore.getState()).toMatchObject({ jobs: null, total: 0, page: 1 });
  });

  it("records a job-search failure without stale results", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("search unavailable"));

    await useSearchJobStore.getState().querySearchJobs({ keyword: "designer" });

    expect(useSearchJobStore.getState()).toMatchObject({
      jobs: null,
      loading: false,
      error: "search unavailable",
    });
  });
});
