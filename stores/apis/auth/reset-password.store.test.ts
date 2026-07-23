import { beforeEach, describe, expect, it, vi } from "vitest";

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("axios", () => ({
  default: { post, isAxiosError: () => false },
  isAxiosError: () => false,
}));

import { useResetPasswordStore } from "./reset-password.store";

describe("reset-password store", () => {
  beforeEach(() => {
    useResetPasswordStore.setState({
      loading: false,
      error: null,
      message: null,
    });
  });

  it("sends both password fields to the token-scoped endpoint", async () => {
    post.mockResolvedValueOnce({ data: { message: "Password updated" } });

    await useResetPasswordStore
      .getState()
      .resetPassword("reset-token", "new-secret", "new-secret");

    expect(post).toHaveBeenCalledWith(
      expect.stringContaining("/reset-password/reset-token"),
      { newPassword: "new-secret", confirmPassword: "new-secret" },
    );
    expect(useResetPasswordStore.getState()).toMatchObject({
      loading: false,
      error: null,
      message: "Password updated",
    });
  });

  it("does not leave the store loading after failure", async () => {
    post.mockRejectedValueOnce(new Error("Token expired"));

    await useResetPasswordStore
      .getState()
      .resetPassword("expired", "new-secret", "new-secret");

    expect(useResetPasswordStore.getState()).toMatchObject({
      loading: false,
      error: "Token expired",
      message: "Token expired",
    });
  });
});
