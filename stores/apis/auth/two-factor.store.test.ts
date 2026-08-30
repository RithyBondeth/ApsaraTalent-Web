import { beforeEach, describe, expect, it, vi } from "vitest";

const { post, setSessionRole } = vi.hoisted(() => ({
  post: vi.fn(),
  setSessionRole: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({ default: { post } }));
vi.mock("@/utils/auth/cookie-manager", () => ({ setSessionRole }));

import { useTwoFactorStore } from "./two-factor.store";

describe("two-factor store", () => {
  beforeEach(() => {
    useTwoFactorStore.getState().reset();
  });

  it("stores the QR code and secret returned by setup", async () => {
    post.mockResolvedValueOnce({
      data: { qrCodeUrl: "data:image/png;base64,qr", secret: "SECRET" },
    });

    await useTwoFactorStore.getState().setup();

    expect(post).toHaveBeenCalledWith(expect.stringContaining("/setup"));
    expect(useTwoFactorStore.getState()).toMatchObject({
      loading: false,
      error: null,
      qrCodeUrl: "data:image/png;base64,qr",
      secret: "SECRET",
    });
  });

  it.each([
    ["enable", "123456"],
    ["disable", "654321"],
  ] as const)("returns true when %s succeeds", async (method, otp) => {
    post.mockResolvedValueOnce({ data: {} });

    await expect(useTwoFactorStore.getState()[method](otp)).resolves.toBe(true);
    expect(post).toHaveBeenCalledWith(expect.any(String), { otp });
    expect(useTwoFactorStore.getState().loading).toBe(false);
  });

  it("returns false and records an invalid-code failure", async () => {
    post.mockRejectedValueOnce(new Error("Invalid authenticator code"));

    await expect(useTwoFactorStore.getState().enable("000000")).resolves.toBe(
      false,
    );
    expect(useTwoFactorStore.getState()).toMatchObject({
      loading: false,
      error: "Invalid authenticator code",
    });
  });

  it("verifies login and persists the returned role preference", async () => {
    post.mockResolvedValueOnce({
      data: { user: { id: "user-1", role: "company" } },
    });

    await expect(
      useTwoFactorStore
        .getState()
        .verifyLogin("challenge-token", "123456", true),
    ).resolves.toBe(true);
    // The signed challenge goes to the server, never a raw user id — an id is
    // public, so sending one proved nothing about who was asking.
    expect(post).toHaveBeenCalledWith(expect.any(String), {
      twoFactorToken: "challenge-token",
      otp: "123456",
    });
    expect(setSessionRole).toHaveBeenCalledWith("company", true);
  });

  it("reset removes secrets and errors", () => {
    useTwoFactorStore.setState({
      loading: true,
      error: "old error",
      qrCodeUrl: "old qr",
      secret: "old secret",
    });

    useTwoFactorStore.getState().reset();

    expect(useTwoFactorStore.getState()).toMatchObject({
      loading: false,
      error: null,
      qrCodeUrl: null,
      secret: null,
    });
  });
});
