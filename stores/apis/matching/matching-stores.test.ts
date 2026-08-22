import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAiMatchExplanationStore } from "./ai-match-explanation.store";
import { useAnalyticsStore } from "./analytics.store";
import { useCompanyLikeStore } from "./company-like.store";
import { useCountCurrentCompanyMatchingStore } from "./count-current-company-matching.store";
import { useCountCurrentEmployeeMatchingStore } from "./count-current-employee-matching.store";
import { useEmployeeLikeStore } from "./employee-like.store";
import { useGetCurrentCompanyLikedStore } from "./get-current-company-liked.store";
import { useGetCurrentCompanyMatchingStore } from "./get-current-company-matching.store";
import { useGetCurrentEmployeeLikedStore } from "./get-current-employee-liked.store";
import { useGetCurrentEmployeeMatchingStore } from "./get-current-employee-matching.store";
import { useInterviewStore } from "./interview.store";
import { useUnmatchStore } from "./unmatch.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("matching and interview API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    localStorage.clear();
    useAiMatchExplanationStore.setState({
      loading: false,
      error: null,
      data: null,
    });
    useAnalyticsStore.setState({ loading: false, error: null, data: null });
    useCompanyLikeStore.setState({ loading: false, error: null, data: null });
    useEmployeeLikeStore.setState({ loading: false, error: null, data: null });
    useCountCurrentCompanyMatchingStore.setState({
      totalCmpMatching: null,
      seenCmpMatching: 0,
      loading: false,
      error: null,
    });
    useCountCurrentEmployeeMatchingStore.setState({
      totalEmpMatching: null,
      seenEmpMatching: 0,
      loading: false,
      error: null,
    });
    useGetCurrentCompanyLikedStore.setState({
      currentCompanyLiked: null,
      loading: false,
      error: null,
    });
    useGetCurrentEmployeeLikedStore.setState({
      currentEmployeeLiked: null,
      loading: false,
      error: null,
    });
    useGetCurrentCompanyMatchingStore.setState({
      currentCompanyMatching: null,
      countCurrentCompanyMatching: 0,
      loading: false,
      error: null,
    });
    useGetCurrentEmployeeMatchingStore.setState({
      currentEmployeeMatching: null,
      countCurrentEmployeeMatching: 0,
      loading: false,
      error: null,
    });
    useInterviewStore.setState({
      interviews: [],
      loading: false,
      error: null,
      creating: false,
      updatingId: null,
    });
    useUnmatchStore.setState({
      message: null,
      unmatchLoading: false,
      unmatchingId: null,
      unmatchError: null,
    });
  });

  it("fetches an AI match explanation", async () => {
    const explanation = { summary: "Strong skills alignment", score: 91 };
    axiosMocks.get.mockResolvedValueOnce({ data: explanation });

    const result = await useAiMatchExplanationStore
      .getState()
      .fetchMatchExplanation("employee-1", "company-1", "en");

    expect(result).toBe(explanation);
    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("employee-1");
    expect(useAiMatchExplanationStore.getState()).toMatchObject({
      data: explanation,
      loading: false,
      error: null,
    });
  });

  it("loads matching analytics", async () => {
    const analytics = {
      totalLikesGiven: 4,
      totalLikesReceived: 3,
      totalMatches: 2,
      matchRate: 50,
      totalFavorites: 1,
      weeklyActivity: [],
      recentMatches: [],
    };
    axiosMocks.get.mockResolvedValueOnce({ data: analytics });

    await useAnalyticsStore.getState().queryAnalytics("employee-1", "employee");

    expect(axiosMocks.get.mock.calls[0]?.[0]).toContain("employee-1");
    expect(useAnalyticsStore.getState().data).toEqual(analytics);
  });

  it("submits company and employee likes", async () => {
    const match = { employeeLiked: true, companyLiked: true, isMatched: true };
    axiosMocks.post
      .mockResolvedValueOnce({ data: match })
      .mockResolvedValueOnce({ data: match });

    await useCompanyLikeStore.getState().companyLike("company-1", "employee-1");
    await useEmployeeLikeStore
      .getState()
      .employeeLike("employee-1", "company-1");

    expect(axiosMocks.post).toHaveBeenCalledTimes(2);
    expect(useCompanyLikeStore.getState().data).toBe(match);
    expect(useEmployeeLikeStore.getState().data).toBe(match);
  });

  it("loads, persists, increments, and decrements company match counts", async () => {
    localStorage.setItem("matching-seen:cmp:company-1", "2");
    axiosMocks.get.mockResolvedValueOnce({ data: { count: 5 } });

    await useCountCurrentCompanyMatchingStore
      .getState()
      .countCurrentCmpMatching("company-1");
    expect(useCountCurrentCompanyMatchingStore.getState()).toMatchObject({
      totalCmpMatching: 5,
      seenCmpMatching: 2,
    });

    useCountCurrentCompanyMatchingStore.getState().markAsSeen("company-1");
    useCountCurrentCompanyMatchingStore.getState().incrementCount();
    useCountCurrentCompanyMatchingStore.getState().decrementCount();
    expect(localStorage.getItem("matching-seen:cmp:company-1")).toBe("5");
    expect(useCountCurrentCompanyMatchingStore.getState()).toMatchObject({
      totalCmpMatching: 5,
      seenCmpMatching: 4,
    });
  });

  it("loads, persists, increments, and decrements employee match counts", async () => {
    localStorage.setItem("matching-seen:emp:employee-1", "1");
    axiosMocks.get.mockResolvedValueOnce({ data: { count: 3 } });

    await useCountCurrentEmployeeMatchingStore
      .getState()
      .countCurrentEmpMatching("employee-1");
    useCountCurrentEmployeeMatchingStore.getState().markAsSeen("employee-1");
    useCountCurrentEmployeeMatchingStore.getState().incrementCount();
    useCountCurrentEmployeeMatchingStore.getState().decrementCount();

    expect(localStorage.getItem("matching-seen:emp:employee-1")).toBe("3");
    expect(useCountCurrentEmployeeMatchingStore.getState()).toMatchObject({
      totalEmpMatching: 3,
      seenEmpMatching: 2,
    });
  });

  it("loads and optimistically extends both liked lists without duplicates", async () => {
    const employee = { id: "employee-1", firstname: "Sokha" };
    const company = { id: "company-1", name: "Apsara" };
    axiosMocks.get
      .mockResolvedValueOnce({ data: [employee] })
      .mockResolvedValueOnce({ data: [company] });

    await useGetCurrentCompanyLikedStore
      .getState()
      .queryCurrentCompanyLiked("company-1");
    await useGetCurrentEmployeeLikedStore
      .getState()
      .queryCurrentEmployeeLiked("employee-1");
    useGetCurrentCompanyLikedStore
      .getState()
      .optimisticAddLiked(employee as never);
    useGetCurrentEmployeeLikedStore
      .getState()
      .optimisticAddLiked(company as never);

    expect(
      useGetCurrentCompanyLikedStore.getState().currentCompanyLiked,
    ).toEqual([employee]);
    expect(
      useGetCurrentEmployeeLikedStore.getState().currentEmployeeLiked,
    ).toEqual([company]);
  });

  it("loads, silently refreshes, and removes matches for both roles", async () => {
    const employee1 = { id: "employee-1" };
    const employee2 = { id: "employee-2" };
    const company1 = { id: "company-1" };
    const company2 = { id: "company-2" };
    axiosMocks.get
      .mockResolvedValueOnce({ data: [employee1, employee2] })
      .mockResolvedValueOnce({ data: [employee2] })
      .mockResolvedValueOnce({ data: [company1, company2] })
      .mockResolvedValueOnce({ data: [company2] });

    await useGetCurrentCompanyMatchingStore
      .getState()
      .queryCurrentCompanyMatching("company-1");
    await useGetCurrentCompanyMatchingStore
      .getState()
      .silentRefetch("company-1");
    useGetCurrentCompanyMatchingStore.getState().removeMatch("employee-2");
    await useGetCurrentEmployeeMatchingStore
      .getState()
      .queryCurrentEmployeeMatching("employee-1");
    await useGetCurrentEmployeeMatchingStore
      .getState()
      .silentRefetch("employee-1");
    useGetCurrentEmployeeMatchingStore.getState().removeMatch("company-2");

    expect(useGetCurrentCompanyMatchingStore.getState()).toMatchObject({
      currentCompanyMatching: [],
      countCurrentCompanyMatching: 0,
    });
    expect(useGetCurrentEmployeeMatchingStore.getState()).toMatchObject({
      currentEmployeeMatching: [],
      countCurrentEmployeeMatching: 0,
    });
  });

  it("queries, creates, updates, silently refreshes, and removes interviews", async () => {
    const interview = {
      id: "interview-1",
      employee: { id: "employee-1" },
      company: { id: "company-1" },
      status: "pending",
    };
    const secondInterview = {
      ...interview,
      id: "interview-2",
      employee: { id: "employee-2" },
    };
    axiosMocks.get
      .mockResolvedValueOnce({ data: [interview] })
      .mockResolvedValueOnce({ data: [interview, secondInterview] });
    axiosMocks.post.mockResolvedValueOnce({ data: secondInterview });
    axiosMocks.patch.mockResolvedValueOnce({
      data: { ...interview, status: "accepted" },
    });

    await useInterviewStore
      .getState()
      .queryInterviews("employee-1", "employee");
    await useInterviewStore.getState().createInterview({
      employeeId: "employee-2",
      companyId: "company-1",
      title: "Technical interview",
      scheduledAt: "2026-08-01T10:00:00.000Z",
      createdBy: "company-1",
    });
    expect(
      await useInterviewStore
        .getState()
        .updateStatus("interview-1", "accepted"),
    ).toBe(true);
    await useInterviewStore.getState().silentRefetch("company-1", "company");
    useInterviewStore.getState().removeInterviewsByPartnerId("employee-2");

    expect(useInterviewStore.getState().interviews).toEqual([interview]);
    expect(axiosMocks.patch).toHaveBeenCalledWith(expect.any(String), {
      interviewId: "interview-1",
      status: "accepted",
    });
  });

  it("unmatches a company and employee", async () => {
    axiosMocks.delete.mockResolvedValueOnce({ data: { message: "Unmatched" } });

    await useUnmatchStore.getState().unmatch("employee-1", "company-1", true);

    expect(axiosMocks.delete.mock.calls[0]?.[0]).toContain("employee-1");
    expect(useUnmatchStore.getState()).toMatchObject({
      message: "Unmatched",
      unmatchLoading: false,
      unmatchingId: null,
      unmatchError: null,
    });
  });
});
