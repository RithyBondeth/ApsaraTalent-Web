import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  normalizeMediaUrlsDeep: vi.fn(),
  use: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { create: mocks.create },
}));

vi.mock("@/utils/functions/media", () => ({
  normalizeMediaUrlsDeep: mocks.normalizeMediaUrlsDeep,
}));

describe("configured axios client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mocks.create.mockReturnValue({
      interceptors: { response: { use: mocks.use } },
    });
  });

  it("creates a credentialed private client and normalizes response media", async () => {
    const normalized = { avatar: "https://cdn.example.com/avatar.png" };
    mocks.normalizeMediaUrlsDeep.mockReturnValue(normalized);

    const axiosModule = await import("./axios");

    expect(mocks.create).toHaveBeenCalledWith({
      withCredentials: true,
      timeout: 30_000,
    });
    expect(axiosModule.default).toBe(mocks.create.mock.results[0].value);
    const interceptor = mocks.use.mock.calls[0][0] as (response: {
      data?: unknown;
    }) => { data?: unknown };
    const response = interceptor({ data: { avatar: "/storage/avatar.png" } });
    expect(mocks.normalizeMediaUrlsDeep).toHaveBeenCalledWith({
      avatar: "/storage/avatar.png",
    });
    expect(response.data).toBe(normalized);
  });

  it("leaves responses without data untouched", async () => {
    await import("./axios");
    const interceptor = mocks.use.mock.calls[0][0] as (
      response: object,
    ) => object;
    const response = {};

    expect(interceptor(response)).toBe(response);
    expect(mocks.normalizeMediaUrlsDeep).not.toHaveBeenCalled();
  });
});
