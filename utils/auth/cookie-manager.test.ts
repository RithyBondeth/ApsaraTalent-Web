import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

const { deleteCookie, getCookie, setCookie } = vi.hoisted(() => ({
  deleteCookie: vi.fn(),
  getCookie: vi.fn(),
  setCookie: vi.fn(),
}));

vi.mock("cookies-next", () => ({ deleteCookie, getCookie, setCookie }));

import {
  clearAuthCookies,
  clearAuthCookiesServerSide,
  getRememberPreference,
  setSessionRole,
} from "./cookie-manager";

function createStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, String(value)),
  };
}

describe("cookie manager", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createStorage(),
    });
    Object.defineProperty(window, "sessionStorage", {
      configurable: true,
      value: createStorage(),
    });
  });

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("stores role and remember preference without authentication tokens", () => {
    setSessionRole("employee", true);

    expect(setCookie).toHaveBeenCalledTimes(2);
    expect(setCookie).toHaveBeenNthCalledWith(
      1,
      COOKIE_CONFIG.SESSION_ROLE,
      "employee",
      expect.objectContaining({
        maxAge: COOKIE_CONFIG.PREFERENCE_STORAGE,
        sameSite: "strict",
        path: "/",
      }),
    );
    expect(setCookie).toHaveBeenNthCalledWith(
      2,
      COOKIE_CONFIG.REMEMBER_PREFERENCE,
      "true",
      expect.any(Object),
    );
  });

  it("does not write cookies when no role is provided", () => {
    setSessionRole(null, true);
    setSessionRole(undefined, false);

    expect(setCookie).not.toHaveBeenCalled();
  });

  it("clears cookies and legacy browser token storage", () => {
    localStorage.setItem(COOKIE_CONFIG.AUTH_TOKEN, "legacy-access");
    sessionStorage.setItem(COOKIE_CONFIG.REFRESH_TOKEN, "legacy-refresh");

    clearAuthCookies();

    expect(deleteCookie).toHaveBeenCalledTimes(8);
    expect(localStorage.getItem(COOKIE_CONFIG.AUTH_TOKEN)).toBeNull();
    expect(sessionStorage.getItem(COOKIE_CONFIG.REFRESH_TOKEN)).toBeNull();
  });

  it.each([
    [true, true],
    [false, false],
  ])("returns %s when the server logout response is %s", async (ok, expected) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({ ok } as Response);

    await expect(clearAuthCookiesServerSide()).resolves.toBe(expected);
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: "POST", credentials: "include" }),
    );
  });

  it("returns false when the server logout request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline"));

    await expect(clearAuthCookiesServerSide()).resolves.toBe(false);
  });

  it("reads the remember preference strictly", () => {
    getCookie.mockReturnValueOnce("true").mockReturnValueOnce("1");

    expect(getRememberPreference()).toBe(true);
    expect(getRememberPreference()).toBe(false);
  });
});
