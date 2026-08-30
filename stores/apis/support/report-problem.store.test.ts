import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useReportProblemStore } from "./report-problem.store";

describe("report-problem store", () => {
  beforeEach(() => {
    post.mockReset();
    useReportProblemStore.getState().reset();
  });

  it("sends the category, details and the page context", async () => {
    post.mockResolvedValueOnce({ data: { message: "Report received" } });

    const ok = await useReportProblemStore
      .getState()
      .reportProblem("bug", "The feed will not load");

    expect(ok).toBe(true);
    const [url, body] = post.mock.calls[0];
    expect(url).toMatch(/\/user\/support\/report-problem$/);
    expect(body).toMatchObject({
      category: "bug",
      details: "The feed will not load",
    });
    // Diagnostic context the reporter would otherwise have to describe.
    expect(body).toHaveProperty("pageUrl");
    expect(body).toHaveProperty("userAgent");
    expect(useReportProblemStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "Report received",
    });
  });

  it("reports failure to the caller and keeps no stale message", async () => {
    post.mockRejectedValueOnce(new Error("Too many requests"));

    const ok = await useReportProblemStore
      .getState()
      .reportProblem("account", "Cannot sign in");

    expect(ok).toBe(false);
    expect(useReportProblemStore.getState()).toMatchObject({
      loading: false,
      error: "Too many requests",
      // A failed send must not leave a message that reads like success.
      message: null,
    });
  });
});
