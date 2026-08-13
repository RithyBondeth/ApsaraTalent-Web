import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useForgotPasswordStore } from "./forgot-password.store";

describe("forgot-password store", () => {
  beforeEach(() => {
    useForgotPasswordStore.setState({
      loading: false,
      error: null,
      message: null,
    });
  });

  it("submits the identifier and exposes the success message", async () => {
    post.mockResolvedValueOnce({ data: { message: "Reset email sent" } });

    await useForgotPasswordStore.getState().forgotPassword("user@example.com");

    expect(post).toHaveBeenCalledWith(expect.any(String), {
      identifier: "user@example.com",
    });
    expect(useForgotPasswordStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "Reset email sent",
    });
  });

  it("exits loading and exposes a request failure", async () => {
    post.mockRejectedValueOnce(new Error("Email service unavailable"));

    await useForgotPasswordStore.getState().forgotPassword("user@example.com");

    expect(useForgotPasswordStore.getState()).toMatchObject({
      loading: false,
      error: "Email service unavailable",
      message: "Email service unavailable",
    });
  });
});
