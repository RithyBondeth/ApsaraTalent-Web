import { beforeEach, describe, expect, it, vi } from "vitest";

import { useGetCompanyRecommendationsStore } from "./get-company-recommendations.store";
import { useGetEmployeeRecommendationsStore } from "./get-employee-recommendations.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("recommendation API stores", () => {
  beforeEach(() => {
    axiosMocks.get.mockReset();
    useGetCompanyRecommendationsStore.setState({
      recommendations: null,
      loading: false,
      error: null,
    });
    useGetEmployeeRecommendationsStore.setState({
      recommendations: null,
      loading: false,
      error: null,
    });
  });

  it("loads employee recommendations for a company", async () => {
    const employees = [{ id: "employee-1", firstname: "Sokha" }];
    axiosMocks.get.mockResolvedValueOnce({ data: employees });

    await useGetCompanyRecommendationsStore
      .getState()
      .queryCompanyRecommendations("company-1", 6);

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("company-1");
    expect(useGetCompanyRecommendationsStore.getState()).toMatchObject({
      recommendations: employees,
      loading: false,
      error: null,
    });
  });

  it("loads company recommendations for an employee", async () => {
    const companies = [{ id: "company-1", name: "Apsara" }];
    axiosMocks.get.mockResolvedValueOnce({ data: companies });

    await useGetEmployeeRecommendationsStore
      .getState()
      .queryEmployeeRecommendations("employee-1", 8);

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("employee-1");
    expect(useGetEmployeeRecommendationsStore.getState()).toMatchObject({
      recommendations: companies,
      loading: false,
      error: null,
    });
  });

  it("treats a missing recommendation set as an empty result", async () => {
    axiosMocks.get.mockRejectedValueOnce({ response: { status: 404 } });

    await useGetCompanyRecommendationsStore
      .getState()
      .queryCompanyRecommendations("company-1");

    expect(axiosMocks.get).toHaveBeenCalledTimes(1);
    expect(useGetCompanyRecommendationsStore.getState()).toMatchObject({
      recommendations: [],
      loading: false,
      error: null,
    });
  });
});
