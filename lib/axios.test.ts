import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  post: vi.fn(),
  normalizeMediaUrlsDeep: vi.fn(),
  use: vi.fn(),
  instance: vi.fn(),
  clearAuthCookies: vi.fn(),
  hasWebSession: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { create: mocks.create, post: mocks.post },
}));

vi.mock("@/utils/functions/media", () => ({
  normalizeMediaUrlsDeep: mocks.normalizeMediaUrlsDeep,
}));

vi.mock("@/utils/auth/cookie-manager", () => ({
  clearAuthCookies: mocks.clearAuthCookies,
  hasWebSession: mocks.hasWebSession,
}));

/** Load the module and hand back its two registered interceptor handlers. */
const loadClient = async () => {
  const axiosModule = await import("./axios");
  const [onFulfilled, onRejected] = mocks.use.mock.calls[0] as [
    (response: { data?: unknown }) => { data?: unknown },
    (error: unknown) => Promise<unknown>,
  ];
  return { client: axiosModule.default, onFulfilled, onRejected };
};

const unauthorized = (config: Record<string, unknown> | undefined = {}) => ({
  response: { status: 401 },
  config,
});

const setLocation = (pathname: string, search = "") => {
  const replace = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { pathname, search, replace },
  });
  return replace;
};

describe("configured axios client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // The retry path calls the instance as a function, so it must be callable.
    Object.assign(mocks.instance, {
      interceptors: { response: { use: mocks.use } },
    });
    mocks.create.mockReturnValue(mocks.instance);
    mocks.hasWebSession.mockReturnValue(true);
    setLocation("/feed");
  });

  it("creates a credentialed private client and normalizes response media", async () => {
    const normalized = { avatar: "https://cdn.example.com/avatar.png" };
    mocks.normalizeMediaUrlsDeep.mockReturnValue(normalized);

    const { client, onFulfilled } = await loadClient();

    expect(mocks.create).toHaveBeenCalledWith({
      withCredentials: true,
      timeout: 30_000,
    });
    expect(client).toBe(mocks.instance);
    const response = onFulfilled({ data: { avatar: "/storage/avatar.png" } });
    expect(mocks.normalizeMediaUrlsDeep).toHaveBeenCalledWith({
      avatar: "/storage/avatar.png",
    });
    expect(response.data).toBe(normalized);
  });

  it("leaves responses without data untouched", async () => {
    const { onFulfilled } = await loadClient();
    const response = {};

    expect(onFulfilled(response)).toBe(response);
    expect(mocks.normalizeMediaUrlsDeep).not.toHaveBeenCalled();
  });

  describe("401 recovery", () => {
    it("refreshes the session and replays the original request", async () => {
      mocks.post.mockResolvedValue({ data: {} });
      const replayed = { data: { id: "user-1" } };
      mocks.instance.mockResolvedValue(replayed);
      const { onRejected } = await loadClient();

      const config = { url: "/user/current" };
      await expect(onRejected(unauthorized(config))).resolves.toBe(replayed);

      expect(mocks.post).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        null,
        { withCredentials: true, timeout: 30_000 },
      );
      expect(mocks.instance).toHaveBeenCalledWith(config);
      expect(mocks.clearAuthCookies).not.toHaveBeenCalled();
    });

    it("issues a single refresh for a burst of concurrent 401s", async () => {
      let resolveRefresh: (value: unknown) => void = () => {};
      mocks.post.mockReturnValue(
        new Promise((resolve) => {
          resolveRefresh = resolve;
        }),
      );
      mocks.instance.mockResolvedValue({ data: {} });
      const { onRejected } = await loadClient();

      const pending = [
        onRejected(unauthorized({ url: "/a" })),
        onRejected(unauthorized({ url: "/b" })),
        onRejected(unauthorized({ url: "/c" })),
      ];
      resolveRefresh({ data: {} });
      await Promise.all(pending);

      expect(mocks.post).toHaveBeenCalledTimes(1);
      expect(mocks.instance).toHaveBeenCalledTimes(3);
    });

    it("clears session state and redirects to login when refresh fails", async () => {
      const replace = setLocation("/message", "?thread=42");
      mocks.post.mockRejectedValue(new Error("no refresh token"));
      const { onRejected } = await loadClient();

      const error = unauthorized({ url: "/user/current" });
      await expect(onRejected(error)).rejects.toBe(error);

      expect(mocks.clearAuthCookies).toHaveBeenCalledOnce();
      expect(replace).toHaveBeenCalledWith(
        `/login?callbackUrl=${encodeURIComponent("/message?thread=42")}`,
      );
    });

    it("redirects only once across a burst of failed refreshes", async () => {
      const replace = setLocation("/feed");
      mocks.post.mockRejectedValue(new Error("no refresh token"));
      const { onRejected } = await loadClient();

      await Promise.allSettled([
        onRejected(unauthorized({ url: "/a" })),
        onRejected(unauthorized({ url: "/b" })),
      ]);

      expect(replace).toHaveBeenCalledOnce();
    });

    it("does not redirect away from an auth page", async () => {
      const replace = setLocation("/login");
      mocks.post.mockRejectedValue(new Error("no refresh token"));
      const { onRejected } = await loadClient();

      await expect(onRejected(unauthorized({ url: "/a" }))).rejects.toBeTruthy();

      expect(mocks.clearAuthCookies).toHaveBeenCalledOnce();
      expect(replace).not.toHaveBeenCalled();
    });

    it("retries a given request at most once", async () => {
      mocks.post.mockResolvedValue({ data: {} });
      const { onRejected } = await loadClient();

      const error = unauthorized({ url: "/a", _retriedAfterRefresh: true });
      await expect(onRejected(error)).rejects.toBe(error);

      expect(mocks.post).not.toHaveBeenCalled();
    });

    it("ignores 401s for visitors with no web session", async () => {
      mocks.hasWebSession.mockReturnValue(false);
      const { onRejected } = await loadClient();

      const error = unauthorized({ url: "/a" });
      await expect(onRejected(error)).rejects.toBe(error);

      expect(mocks.post).not.toHaveBeenCalled();
      expect(mocks.clearAuthCookies).not.toHaveBeenCalled();
    });

    it("passes through non-401 errors and configless failures", async () => {
      const { onRejected } = await loadClient();

      const serverError = { response: { status: 500 }, config: { url: "/a" } };
      await expect(onRejected(serverError)).rejects.toBe(serverError);

      const configless = { response: { status: 401 }, config: undefined };
      await expect(onRejected(configless)).rejects.toBe(configless);

      expect(mocks.post).not.toHaveBeenCalled();
    });
  });
});
