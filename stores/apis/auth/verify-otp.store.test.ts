import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, clearAuthCookies, setSessionRole, clearUser } = vi.hoisted(() => ({
  post: vi.fn(),
  clearAuthCookies: vi.fn(),
  setSessionRole: vi.fn(),
  clearUser: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: { post } }));
vi.mock("@/utils/auth/cookie-manager", () => ({
  clearAuthCookies,
  setSessionRole,
}));
vi.mock("../users/get-current-user.store", () => ({
  useGetCurrentUserStore: { getState: () => ({ clearUser }) },
}));

import { useVerifyOTPStore } from "./verify-otp.store";

describe("verify OTP store", () => {
  beforeEach(() => {
    useVerifyOTPStore.setState({
      loading: false,
      error: null,
      isAuthenticated: false,
      role: null,
      user: null,
      message: null,
    });
  });

  it("authenticates a fully onboarded user and persists the role", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Verified",
        user: { id: "user-1", role: "employee" },
      },
    });

    await useVerifyOTPStore
      .getState()
      .verifyOtp("012345678", "123456", true);

    expect(post).toHaveBeenCalledWith(expect.any(String), {
      phone: "012345678",
      otp: "123456",
    });
    expect(setSessionRole).toHaveBeenCalledWith("employee", true);
    expect(useVerifyOTPStore.getState()).toMatchObject({
      loading: false,
      error: null,
      isAuthenticated: true,
      role: "employee",
      message: "Verified",
    });
  });

  it("keeps a role-less user unauthenticated and clears stale cookies", async () => {
    post.mockResolvedValueOnce({
      data: {
        message: "Choose a role",
        user: { id: "user-1", role: "none" },
      },
    });

    await useVerifyOTPStore
      .getState()
      .verifyOtp("012345678", "123456", false);

    expect(setSessionRole).not.toHaveBeenCalled();
    expect(clearAuthCookies).toHaveBeenCalledOnce();
    expect(useVerifyOTPStore.getState().isAuthenticated).toBe(false);
  });

  it("exposes invalid OTP failures without authenticating", async () => {
    post.mockRejectedValueOnce(new Error("Invalid OTP"));

    await useVerifyOTPStore
      .getState()
      .verifyOtp("012345678", "000000", false);

    expect(useVerifyOTPStore.getState()).toMatchObject({
      loading: false,
      isAuthenticated: false,
      error: "Invalid OTP",
      message: "Invalid OTP",
    });
  });

  it("clears cookies, user data, and authentication state", () => {
    useVerifyOTPStore.setState({
      isAuthenticated: true,
      message: "Verified",
    });

    useVerifyOTPStore.getState().clearToken();

    expect(clearAuthCookies).toHaveBeenCalledOnce();
    expect(clearUser).toHaveBeenCalledOnce();
    expect(useVerifyOTPStore.getState()).toMatchObject({
      loading: false,
      error: null,
      isAuthenticated: false,
      message: null,
    });
  });
});
