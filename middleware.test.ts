import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "./middleware";
import { COOKIE_CONFIG } from "@/utils/constants/cookie.constant";

function request(path: string, role?: string) {
  const headers = new Headers();
  if (role) {
    headers.set("cookie", `${COOKIE_CONFIG.SESSION_ROLE}=${role}`);
  }
  return new NextRequest(`https://app.example.com${path}`, { headers });
}

function redirectLocation(path: string, role?: string) {
  return middleware(request(path, role)).headers.get("location");
}

describe("authentication middleware", () => {
  it("redirects an anonymous protected request and preserves its callback", () => {
    const location = redirectLocation("/search/employee?q=typescript&page=2");
    const url = new URL(location!);

    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("callbackUrl")).toBe(
      "/search/employee?q=typescript&page=2",
    );
  });

  it.each(["/feed", "/profile/employee", "/resume-builder/edit"])(
    "allows an authenticated user to access %s",
    (path) => {
      const response = middleware(request(path, "employee"));

      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it.each(["/login", "/signup/company", "/"])(
    "redirects an authenticated user away from %s",
    (path) => {
      expect(new URL(redirectLocation(path, "employee")!).pathname).toBe(
        "/feed",
      );
    },
  );

  it("forces a user without a role into onboarding", () => {
    expect(new URL(redirectLocation("/dashboard", "none")!).pathname).toBe(
      "/signup/option",
    );
  });

  it("allows a user without a role to remain on an auth route", () => {
    const response = middleware(request("/signup/option", "none"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("does not intercept unrelated routes", () => {
    const response = middleware(request("/privacy"));

    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
