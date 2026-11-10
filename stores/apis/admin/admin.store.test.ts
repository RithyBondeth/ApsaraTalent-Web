import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAdminStore } from "./admin.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  patch: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

const emptyPage = { items: [], total: 0, page: 1, limit: 25 };

describe("admin store", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useAdminStore.setState({
      overview: null,
      users: null,
      userDetail: null,
      reports: null,
      problemReports: null,
      audit: null,
      loadingOverview: false,
      loadingUsers: false,
      loadingUserDetail: false,
      loadingReports: false,
      loadingProblemReports: false,
      loadingAudit: false,
      saving: false,
      error: null,
    });
  });

  it("drops empty filters instead of sending them", async () => {
    // `search=` reaches the API as a valid empty term, which the service then
    // matches every row against — the most expensive query on the platform.
    axiosMocks.get.mockResolvedValue({ data: emptyPage });

    await useAdminStore.getState().getUsers({
      page: 1,
      limit: 25,
      search: "",
      role: undefined,
    });

    expect(axiosMocks.get).toHaveBeenCalledWith(
      expect.stringContaining("/admin/users"),
      { params: { page: 1, limit: 25 } },
    );
  });

  it("refetches the account after a status change rather than guessing", async () => {
    // The server derives the effective status and appends an audit row, so a
    // local patch would be wrong in exactly the cases that matter.
    axiosMocks.patch.mockResolvedValue({
      data: { message: "Account banned." },
    });
    axiosMocks.get.mockResolvedValue({
      data: { id: "user-2", status: "banned", storedStatus: "banned" },
    });

    const ok = await useAdminStore.getState().updateUserStatus("user-2", {
      status: "banned",
      reason: "Confirmed scam account",
    });

    expect(ok).toBe(true);
    expect(axiosMocks.get).toHaveBeenCalledWith(
      expect.stringContaining("/admin/users/user-2"),
    );
    expect(useAdminStore.getState().userDetail?.status).toBe("banned");
    expect(useAdminStore.getState().saving).toBe(false);
  });

  it("surfaces the server's refusal and leaves the panel usable", async () => {
    // A real AxiosError, not a shape that looks like one: the extractor gates
    // on axios.isAxiosError, so a plain object silently falls back.
    const refusal = new AxiosError("Request failed with status code 403");
    refusal.response = {
      status: 403,
      data: { message: "Administrator accounts cannot be suspended." },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    axiosMocks.patch.mockRejectedValue(refusal);

    const ok = await useAdminStore.getState().updateUserStatus("user-2", {
      status: "banned",
      reason: "Testing the guard",
    });

    expect(ok).toBe(false);
    expect(useAdminStore.getState().saving).toBe(false);
    expect(useAdminStore.getState().error).toMatch(/Administrator accounts/);
  });

  it("updates a report in place so the row does not jump while it is read", async () => {
    useAdminStore.setState({
      reports: {
        items: [
          { id: "r1", status: "pending" },
          { id: "r2", status: "pending" },
        ],
        total: 2,
        page: 1,
        limit: 25,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });
    axiosMocks.patch.mockResolvedValue({ data: { message: "ok" } });

    await useAdminStore
      .getState()
      .updateReportStatus("r1", { status: "resolved" });

    const items = useAdminStore.getState().reports?.items ?? [];
    expect(items[0].status).toBe("resolved");
    expect(items[1].status).toBe("pending");
  });

  it("keeps the last good page when a refresh fails", async () => {
    useAdminStore.setState({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      users: { ...emptyPage, items: [{ id: "u1" }] } as any,
    });
    axiosMocks.get.mockRejectedValue(new Error("network"));

    await useAdminStore.getState().getUsers({ page: 2 });

    expect(useAdminStore.getState().users?.items).toHaveLength(1);
    expect(useAdminStore.getState().error).toBeTruthy();
  });
});

describe("problem reports", () => {
  it("loads a page from the queue", async () => {
    const page = {
      items: [
        {
          id: "r1",
          category: "bug",
          details: "broke",
          pageUrl: "/x",
          userAgent: "Chrome",
          status: "pending",
          resolutionNote: null,
          createdAt: "2026-08-01T00:00:00.000Z",
          reporter: {
            id: "u1",
            email: "r@example.com",
            role: "employee",
          },
        },
      ],
      total: 1,
      page: 1,
      limit: 25,
    };
    axiosMocks.get.mockResolvedValue({ data: page });

    await useAdminStore
      .getState()
      .getProblemReports({ page: 1, limit: 25, status: "pending" });

    expect(useAdminStore.getState().problemReports).toEqual(page);
    // The query params are pruned like every other admin call — empty
    // fields do not travel to the API.
    expect(axiosMocks.get).toHaveBeenCalledWith(
      expect.stringContaining("/admin/problem-reports"),
      { params: expect.objectContaining({ status: "pending", page: 1 }) },
    );
  });

  it("patches the row in place after a status change", async () => {
    useAdminStore.setState({
      problemReports: {
        items: [
          {
            id: "r1",
            category: "bug",
            details: "broke",
            pageUrl: null,
            userAgent: null,
            status: "pending",
            resolutionNote: null,
            createdAt: "2026-08-01T00:00:00.000Z",
            reporter: null,
          },
        ],
        total: 1,
        page: 1,
        limit: 25,
      },
    });
    axiosMocks.patch.mockResolvedValue({ data: undefined });

    const ok = await useAdminStore.getState().updateProblemReportStatus("r1", {
      status: "resolved",
      note: "shipped",
    });

    expect(ok).toBe(true);
    // Patched in place — the row must not jump out of the list while the
    // admin is still reading it.
    const [row] = useAdminStore.getState().problemReports!.items;
    expect(row.status).toBe("resolved");
    expect(row.resolutionNote).toBe("shipped");
  });

  it("surfaces the error and returns false on a failed patch", async () => {
    axiosMocks.patch.mockRejectedValue(
      new AxiosError("network", "ERR_NETWORK"),
    );

    await expect(
      useAdminStore
        .getState()
        .updateProblemReportStatus("r1", { status: "resolved" }),
    ).resolves.toBe(false);
    expect(useAdminStore.getState().error).toBeTruthy();
  });
});
