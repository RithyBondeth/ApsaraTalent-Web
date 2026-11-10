import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPublicJob, fetchPublicJobSitemap } from "./public-job";

describe("public job fetchers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  describe("fetchPublicJob", () => {
    it("returns the job on a 200", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => ({ id: "job-1", title: "Engineer" }),
      });

      await expect(fetchPublicJob("job-1")).resolves.toEqual({
        id: "job-1",
        title: "Engineer",
      });
    });

    it("returns null on a 404", async () => {
      fetchMock.mockResolvedValue({ ok: false, status: 404 });
      await expect(fetchPublicJob("job-1")).resolves.toBeNull();
    });

    it("returns null when the API is unreachable", async () => {
      fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

      // A 500 would tell search engines "come back later" for a URL that may
      // be permanently gone; the page renders its 404 instead.
      await expect(fetchPublicJob("job-1")).resolves.toBeNull();
    });

    it("asks Next to revalidate rather than caching forever", async () => {
      fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });

      await fetchPublicJob("job-1");

      const [, init] = fetchMock.mock.calls[0];
      expect(init.next.revalidate).toBeGreaterThan(0);
    });
  });

  describe("fetchPublicJobSitemap", () => {
    it("returns the entries on a 200", async () => {
      const entries = [{ id: "job-1", updatedAt: "2026-08-01T00:00:00.000Z" }];
      fetchMock.mockResolvedValue({ ok: true, json: async () => entries });

      await expect(fetchPublicJobSitemap()).resolves.toEqual(entries);
    });

    it("degrades to an empty list rather than throwing", async () => {
      fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

      // Search engines back off from a sitemap that errors, so a backend blip
      // must degrade it to its static half, not break it.
      await expect(fetchPublicJobSitemap()).resolves.toEqual([]);
    });
  });
});
