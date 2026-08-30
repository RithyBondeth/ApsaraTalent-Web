import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, clearAuthCookies, setSessionRole, clearUser } = vi.hoisted(
  () => ({
    post: vi.fn(),
    clearAuthCookies: vi.fn(),
    setSessionRole: vi.fn(),
    clearUser: vi.fn(),
  }),
);

vi.mock("@/lib/axios", () => ({ default: { post } }));
vi.mock("@/utils/auth/cookie-manager", () => ({
  clearAuthCookies,
  setSessionRole,
}));
vi.mock("../users/get-current-user.store", () => ({
  useGetCurrentUserStore: { getState: () => ({ clearUser }) },
}));

import { useLoginStore } from "./login.store";

const authenticatedUser = {
  id: "user-1",
  phone: "012345678",
  role: "employee",
  lastLoginAt: "2026-07-23T00:00:00.000Z",
  lastLoginMethod: "email_password",
};

describe("login store", () => {
  beforeEach(() => {
    useLoginStore.setState({
      loading: false,
      error: null,
      isAuthenticated: false,
      message: null,
      user: null,
      requiresTwoFactor: false,
      pendingTwoFactorToken: null,
      pendingRememberMe: false,
    });
  });

  it("authenticates and stores only non-sensitive role state", async () => {
    post.mockResolvedValueOnce({
      data: { message: "Welcome", user: authenticatedUser },
    });

    await useLoginStore.getState().login("user@example.com", "secret", true);

    expect(post).toHaveBeenCalledWith(expect.any(String), {
      identifier: "user@example.com",
      password: "secret",
    });
    expect(setSessionRole).toHaveBeenCalledWith("employee", true);
    expect(useLoginStore.getState()).toMatchObject({
      loading: false,
      error: null,
      isAuthenticated: true,
      message: "Welcome",
      user: authenticatedUser,
    });
  });

  it("enters the two-factor state without authenticating early", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Two-factor required",
        requiresTwoFactor: true,
        twoFactorToken: "challenge-token",
      },
    });

    await useLoginStore.getState().login("user@example.com", "secret", false);

    expect(setSessionRole).not.toHaveBeenCalled();
    expect(useLoginStore.getState()).toMatchObject({
      isAuthenticated: false,
      requiresTwoFactor: true,
      pendingTwoFactorToken: "challenge-token",
      pendingRememberMe: false,
    });
  });

  it("exposes a safe error and exits loading after a failed request", async () => {
    post.mockRejectedValueOnce(new Error("Network unavailable"));

    await useLoginStore.getState().login("user@example.com", "secret", false);

    expect(useLoginStore.getState()).toMatchObject({
      loading: false,
      isAuthenticated: false,
      error: "Network unavailable",
      message: "Network unavailable",
    });
  });

  it("clears two-factor and authenticated session state", () => {
    useLoginStore.setState({
      isAuthenticated: true,
      requiresTwoFactor: true,
      pendingTwoFactorToken: "challenge-token",
      pendingRememberMe: true,
    });

    useLoginStore.getState().clearTwoFactorPending();
    expect(useLoginStore.getState()).toMatchObject({
      requiresTwoFactor: false,
      pendingTwoFactorToken: null,
      pendingRememberMe: false,
    });

    useLoginStore.getState().clearToken();
    expect(clearAuthCookies).toHaveBeenCalledOnce();
    expect(clearUser).toHaveBeenCalledOnce();
    expect(useLoginStore.getState().isAuthenticated).toBe(false);
  });
});
