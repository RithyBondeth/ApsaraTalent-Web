import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  afterEach(() => vi.useRealTimers());

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

  it("does not retry client errors other than 404", async () => {
    axiosMocks.get.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message: "Invalid recommendation request" },
      },
    });

    await useGetEmployeeRecommendationsStore
      .getState()
      .queryEmployeeRecommendations("employee-1");

    expect(axiosMocks.get).toHaveBeenCalledOnce();
    expect(useGetEmployeeRecommendationsStore.getState()).toMatchObject({
      recommendations: null,
      loading: false,
      error: "Failed to get employee recommendations",
    });
  });

  it("retries temporary server failures and preserves a later success", async () => {
    vi.useFakeTimers();
    const recommendations = [{ id: "company-1", name: "Apsara" }];
    axiosMocks.get
      .mockRejectedValueOnce({ response: { status: 503 } })
      .mockRejectedValueOnce(new Error("temporary network error"))
      .mockResolvedValueOnce({ data: recommendations });

    const request = useGetEmployeeRecommendationsStore
      .getState()
      .queryEmployeeRecommendations("employee-1");
    await vi.runAllTimersAsync();
    await request;

    expect(axiosMocks.get).toHaveBeenCalledTimes(3);
    expect(useGetEmployeeRecommendationsStore.getState()).toMatchObject({
      recommendations,
      loading: false,
      error: null,
    });
  });

  it("reports the last error after company recommendation retries are exhausted", async () => {
    vi.useFakeTimers();
    axiosMocks.get.mockRejectedValue(
      new Error("recommendation service offline"),
    );

    const request = useGetCompanyRecommendationsStore
      .getState()
      .queryCompanyRecommendations("company-1");
    await vi.runAllTimersAsync();
    await request;

    expect(axiosMocks.get).toHaveBeenCalledTimes(3);
    expect(useGetCompanyRecommendationsStore.getState()).toMatchObject({
      recommendations: null,
      loading: false,
      error: "recommendation service offline",
    });
  });
});
