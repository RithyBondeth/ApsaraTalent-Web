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

  it("sends a signed-in visitor from the marketing home to the app", () => {
    expect(redirectLocation("/", "employee")).toBe(
      "https://app.example.com/feed",
    );
  });

  it("lets a signed-in reader reach the informational pages", () => {
    // These used to be guest-landing routes, which made every link in the
    // shared header unusable from /privacy and /terms — the two pages a
    // signed-in reader arrives at from Settings. /support in particular carries
    // the FAQ and contact details, which is what an account holder needs.
    for (const route of ["/product", "/learn", "/safety", "/support"]) {
      const response = middleware(request(route, "employee"));

      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-next")).toBe("1");
    }
  });

  it("keeps email verification reachable for a freshly registered user", () => {
    // Registration signs the person in, so they arrive here authenticated.
    // The generic /login/* bounce would send them to /feed and — now that the
    // mail carries a code rather than a link — strand them there.
    expect(
      redirectLocation("/login/email-verification", "employee"),
    ).toBeNull();
    expect(
      redirectLocation(
        "/login/email-verification?email=person%40example.com",
        "company",
      ),
    ).toBeNull();
  });

  it("still bounces an authenticated user off the other auth routes", () => {
    expect(redirectLocation("/login", "employee")).toContain("/feed");
    expect(redirectLocation("/signup", "employee")).toContain("/feed");
  });
});
