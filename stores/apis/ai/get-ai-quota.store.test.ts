import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAiQuotaStore } from "./get-ai-quota.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("AI quota store", () => {
  beforeEach(() => {
    axiosMocks.get.mockReset();
    useAiQuotaStore.setState({ loading: false, error: null, data: null });
  });

  it("loads the current daily quota", async () => {
    const quota = {
      daily: { used: 2, limit: 10, remaining: 8 },
      resetsAt: "2026-07-24T00:00:00.000Z",
    };
    axiosMocks.get.mockResolvedValueOnce({ data: quota });

    await useAiQuotaStore.getState().fetchQuota();

    expect(useAiQuotaStore.getState()).toMatchObject({
      data: quota,
      loading: false,
      error: null,
    });
  });

  it("clears loading and records quota failures", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("quota unavailable"));

    await useAiQuotaStore.getState().fetchQuota();

    expect(useAiQuotaStore.getState()).toMatchObject({
      data: null,
      loading: false,
      error: "quota unavailable",
    });
  });
});
