import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useVerifyEmailStore } from "./verify-email.store";

describe("verify-email store", () => {
  beforeEach(() => {
    useVerifyEmailStore.setState({ loading: false, error: null, message: null });
  });

  it("uses the verification token in the endpoint", async () => {
    post.mockResolvedValueOnce({ data: { message: "Email verified" } });

    await useVerifyEmailStore.getState().verifyEmail("verification-token");

    expect(post).toHaveBeenCalledWith(
      expect.stringContaining("/verify-email/verification-token"),
    );
    expect(useVerifyEmailStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "Email verified",
    });
  });

  it("exits loading when verification fails", async () => {
    post.mockRejectedValueOnce(new Error("Verification link expired"));

    await useVerifyEmailStore.getState().verifyEmail("expired-token");

    expect(useVerifyEmailStore.getState()).toMatchObject({
      loading: false,
      error: "Verification link expired",
      message: "Verification link expired",
    });
  });
});
