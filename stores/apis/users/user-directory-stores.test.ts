import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetAllCareerScopesStore } from "./get-all-career-scopes.store";
import { useGetLandingStatsStore } from "./get-landing-stats.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("user directory API stores", () => {
  beforeEach(() => {
    axiosMocks.get.mockReset();
    useGetAllCareerScopesStore.setState({ careerScopes: null, loading: false, error: null });
    useGetLandingStatsStore.setState({
      stats: null,
      loading: false,
      initialized: false,
      error: null,
    });
  });

  it("loads career scopes", async () => {
    const careerScopes = [{ id: "scope-1", name: "Software Engineering" }];
    axiosMocks.get.mockResolvedValueOnce({ data: careerScopes });

    await useGetAllCareerScopesStore.getState().getAllCareerScopes();

    expect(useGetAllCareerScopesStore.getState()).toMatchObject({
      careerScopes,
      loading: false,
      error: null,
    });
  });

  it("loads and initializes public landing statistics", async () => {
    const stats = { users: 120, companies: 40, employees: 80 };
    axiosMocks.get.mockResolvedValueOnce({ data: stats });

    await useGetLandingStatsStore.getState().getLandingStats();

    expect(useGetLandingStatsStore.getState()).toMatchObject({
      stats,
      loading: false,
      initialized: true,
      error: null,
    });
  });

  it("still marks landing statistics initialized after a failure", async () => {
    axiosMocks.get.mockRejectedValueOnce(new Error("stats unavailable"));

    await useGetLandingStatsStore.getState().getLandingStats();

    expect(useGetLandingStatsStore.getState()).toMatchObject({
      stats: null,
      loading: false,
      initialized: true,
      error: "stats unavailable",
    });
  });
});
