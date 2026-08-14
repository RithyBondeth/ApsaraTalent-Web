import { beforeEach, describe, expect, it, vi } from "vitest";
import type { IUser } from "@/utils/interfaces/user/user.interface";

const { get, setSentryUser } = vi.hoisted(() => ({
  get: vi.fn(),
  setSentryUser: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: { get } }));
vi.mock("@sentry/nextjs", () => ({ setUser: setSentryUser }));

import { useGetCurrentUserStore } from "./get-current-user.store";

const user = {
  id: "user-1",
  role: "employee",
  email: "private@example.com",
  // The API omits both profile keys when absent rather than sending null.
  createdAt: "2026-07-23T00:00:00.000Z",
} as IUser;

describe("current-user store", () => {
  beforeEach(() => {
    localStorage.clear();
    useGetCurrentUserStore.setState({
      loading: false,
      error: null,
      user: null,
    });
  });

  it("loads the user, removes legacy persistence, and limits Sentry PII", async () => {
    localStorage.setItem("current-user-store", JSON.stringify(user));
    get.mockResolvedValueOnce({ data: user });

    await useGetCurrentUserStore.getState().getCurrentUser();

    expect(localStorage.getItem("current-user-store")).toBeNull();
    expect(useGetCurrentUserStore.getState()).toMatchObject({
      loading: false,
      error: null,
      user,
    });
    expect(setSentryUser).toHaveBeenCalledWith({
      id: "user-1",
      role: "employee",
    });
    expect(setSentryUser).not.toHaveBeenCalledWith(
      expect.objectContaining({ email: expect.anything() }),
    );
  });

  it("clears stale user data when loading fails", async () => {
    useGetCurrentUserStore.setState({ user });
    get.mockRejectedValueOnce(new Error("Session expired"));

    await useGetCurrentUserStore.getState().getCurrentUser();

    expect(useGetCurrentUserStore.getState()).toMatchObject({
      loading: false,
      user: null,
      error: "Session expired",
    });
  });

  it("clears user identity and legacy storage on logout", () => {
    localStorage.setItem("current-user-store", JSON.stringify(user));
    useGetCurrentUserStore.setState({ user, error: "old error" });

    useGetCurrentUserStore.getState().clearUser();

    expect(localStorage.getItem("current-user-store")).toBeNull();
    expect(useGetCurrentUserStore.getState()).toMatchObject({
      loading: false,
      error: null,
      user: null,
    });
    expect(setSentryUser).toHaveBeenCalledWith(null);
  });
});
