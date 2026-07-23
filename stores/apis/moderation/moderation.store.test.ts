import { beforeEach, describe, expect, it, vi } from "vitest";

import { useModerationStore } from "./moderation.store";

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("moderation store", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useModerationStore.setState({
      statusByTarget: {},
      loadingStatus: false,
      blocking: false,
      reporting: false,
      error: null,
      blockedUsers: [],
      loadingBlocked: false,
      blockedLoaded: false,
      hiddenProfileIds: [],
      hiddenLoaded: false,
    });
  });

  it("loads hidden profiles, blocked users, and target-specific status", async () => {
    const blockedUser = {
      id: "user-2",
      employeeId: "employee-2",
      companyId: null,
      name: "Blocked employee",
      avatar: null,
      role: "employee",
      blockedAt: "2026-07-23T00:00:00.000Z",
    };
    const status = { isBlocked: true, blockedByMe: true, blockedMe: false };
    axiosMocks.get
      .mockResolvedValueOnce({ data: ["employee-2"] })
      .mockResolvedValueOnce({ data: [blockedUser] })
      .mockResolvedValueOnce({ data: status });

    await useModerationStore.getState().getHiddenProfileIds();
    await useModerationStore.getState().getBlockedUsers();
    await useModerationStore.getState().getBlockStatus("employee-2");

    expect(useModerationStore.getState()).toMatchObject({
      hiddenProfileIds: ["employee-2"],
      hiddenLoaded: true,
      blockedUsers: [blockedUser],
      blockedLoaded: true,
      statusByTarget: { "employee-2": status },
      loadingStatus: false,
      error: null,
    });
  });

  it("blocks and unblocks a user while keeping cached state consistent", async () => {
    axiosMocks.post.mockResolvedValueOnce({ data: {} });
    axiosMocks.delete.mockResolvedValueOnce({ data: {} });
    useModerationStore.setState({
      blockedUsers: [
        {
          id: "user-2",
          employeeId: "employee-2",
          companyId: null,
          name: "Blocked employee",
          avatar: null,
          role: "employee",
          blockedAt: "2026-07-23T00:00:00.000Z",
        },
      ],
    });

    await expect(useModerationStore.getState().blockUser("employee-2")).resolves.toBe(true);
    expect(useModerationStore.getState().statusByTarget["employee-2"]).toEqual({
      isBlocked: true,
      blockedByMe: true,
      blockedMe: false,
    });

    await expect(useModerationStore.getState().unblockUser("employee-2")).resolves.toBe(true);
    expect(useModerationStore.getState().statusByTarget["employee-2"]).toEqual({
      isBlocked: false,
      blockedByMe: false,
      blockedMe: false,
    });
    expect(useModerationStore.getState().blockedUsers).toEqual([]);
  });

  it("submits reports and returns false on rejected reports", async () => {
    const payload = { reportedId: "user-2", reason: "spam" as const, details: "Repeated messages" };
    axiosMocks.post
      .mockResolvedValueOnce({ data: {} })
      .mockRejectedValueOnce(new Error("report unavailable"));

    await expect(useModerationStore.getState().reportUser(payload)).resolves.toBe(true);
    await expect(useModerationStore.getState().reportUser(payload)).resolves.toBe(false);
    expect(useModerationStore.getState()).toMatchObject({
      reporting: false,
      error: "report unavailable",
    });
  });
});
