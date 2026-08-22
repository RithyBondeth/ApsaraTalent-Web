import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useVerifyEmailStore } from "./verify-email.store";

describe("verify-email store", () => {
  beforeEach(() => {
    post.mockReset();
    useVerifyEmailStore.getState().reset();
  });

  it("posts the address and code in the body, never the path", async () => {
    post.mockResolvedValueOnce({ data: { message: "Email verified" } });

    const ok = await useVerifyEmailStore
      .getState()
      .verifyEmail("person@example.com", "123456");

    expect(ok).toBe(true);
    const [url, body] = post.mock.calls[0];
    // A six-digit credential in the URL would land in access logs and history.
    expect(url).toMatch(/\/verify-email$/);
    expect(url).not.toContain("123456");
    expect(body).toEqual({ email: "person@example.com", otp: "123456" });
    expect(useVerifyEmailStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "Email verified",
    });
  });

  it("reports failure to the caller and keeps no stale message", async () => {
    post.mockRejectedValueOnce(new Error("Invalid or expired code"));

    const ok = await useVerifyEmailStore
      .getState()
      .verifyEmail("person@example.com", "000000");

    expect(ok).toBe(false);
    expect(useVerifyEmailStore.getState()).toMatchObject({
      loading: false,
      error: "Invalid or expired code",
      // The old store mirrored the error into `message`, so a failed attempt
      // read as if the server had said something reassuring.
      message: null,
    });
  });

  it("resends against its own endpoint and tracks a separate flag", async () => {
    post.mockResolvedValueOnce({ data: { message: "Code on its way" } });

    const ok = await useVerifyEmailStore
      .getState()
      .resendOtp("person@example.com");

    expect(ok).toBe(true);
    const [url, body] = post.mock.calls[0];
    expect(url).toMatch(/\/verify-email\/resend$/);
    expect(body).toEqual({ email: "person@example.com" });
    expect(useVerifyEmailStore.getState()).toMatchObject({
      resending: false,
      error: null,
    });
  });

  it("exits the resending flag when the resend fails", async () => {
    post.mockRejectedValueOnce(new Error("Too many requests"));

    const ok = await useVerifyEmailStore
      .getState()
      .resendOtp("person@example.com");

    expect(ok).toBe(false);
    expect(useVerifyEmailStore.getState()).toMatchObject({
      resending: false,
      error: "Too many requests",
    });
  });
});
