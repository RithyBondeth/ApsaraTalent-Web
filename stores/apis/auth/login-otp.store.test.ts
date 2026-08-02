import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useLoginOTPStore } from "./login-otp.store";

describe("login OTP store", () => {
  beforeEach(() => {
    useLoginOTPStore.setState({
      loading: false,
      error: null,
      message: null,
      isSuccess: false,
    });
  });

  it("requests an OTP for the supplied phone number", async () => {
    post.mockResolvedValueOnce({ data: { message: "OTP sent" } });

    await useLoginOTPStore.getState().loginOtp("012345678");

    expect(post).toHaveBeenCalledWith(expect.any(String), {
      phone: "012345678",
    });
    expect(useLoginOTPStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "OTP sent",
      isSuccess: true,
    });
  });

  it("clears stale success state when a later request fails", async () => {
    useLoginOTPStore.setState({ isSuccess: true, message: "Old success" });
    post.mockRejectedValueOnce(new Error("SMS provider unavailable"));

    await useLoginOTPStore.getState().loginOtp("012345678");

    expect(useLoginOTPStore.getState()).toMatchObject({
      loading: false,
      error: "SMS provider unavailable",
      message: "SMS provider unavailable",
      isSuccess: false,
    });
  });
});
