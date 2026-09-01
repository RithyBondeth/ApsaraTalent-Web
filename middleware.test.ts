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

describe("content security policy", () => {
  const policyOf = (path: string, role?: string) =>
    middleware(request(path, role)).headers.get("Content-Security-Policy");

  it("carries a policy on a plain pass-through", () => {
    expect(policyOf("/privacy")).toMatch(/script-src/);
  });

  it("mints a different nonce per request", () => {
    // A nonce reused across responses is worth no more than 'unsafe-inline'.
    const first = policyOf("/privacy");
    const second = policyOf("/privacy");
    expect(first).not.toBe(second);
  });

  /*
    Every redirect exit has to carry the policy too, not just the pass-through.
    The admin gates are the newest of them, and they were written on a branch
    where `middleware()` still returned bare NextResponse.redirect(...) calls —
    exactly the shape that silently ships an unprotected document.
  */
  it.each([
    ["a non-admin bounced off the panel", "/admin/users", "employee"],
    ["an admin bounced out of the employee app", "/feed", "admin"],
    ["an anonymous visitor sent to login", "/admin/reports", undefined],
    ["a roleless user sent to onboarding", "/dashboard", "none"],
    ["a signed-in visitor sent off the marketing home", "/", "employee"],
  ])("carries a policy when redirecting %s", (_label, path, role) => {
    const response = middleware(request(path, role as string | undefined));

    expect(response.headers.get("location")).not.toBeNull();
    expect(response.headers.get("Content-Security-Policy")).toMatch(
      /nonce-[a-f0-9]+/,
    );
  });
});

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

  it.each(["/admin", "/admin/users", "/admin/reports"])(
    "lets an administrator into %s",
    (path) => {
      const response = middleware(request(path, "admin"));

      expect(response.headers.get("location")).toBeNull();
      expect(response.headers.get("x-middleware-next")).toBe("1");
    },
  );

  it.each(["employee", "company"])(
    "sends a %s away from the admin panel",
    (role) => {
      // Presentation only — the API refuses these requests regardless. This
      // stops a signed-in user seeing the panel's chrome before every request
      // behind it fails.
      expect(new URL(redirectLocation("/admin/users", role)!).pathname).toBe(
        "/feed",
      );
    },
  );

  it("sends an anonymous visitor to login with /admin as the callback", () => {
    const url = new URL(redirectLocation("/admin/reports")!);

    expect(url.pathname).toBe("/login");
    expect(url.searchParams.get("callbackUrl")).toBe("/admin/reports");
  });

  it.each(["/feed", "/profile", "/matching", "/resume-builder"])(
    "keeps an administrator out of %s",
    (path) => {
      // Every page in the signed-in app outside /admin is built around an
      // employee or company profile an admin account does not have.
      expect(new URL(redirectLocation(path, "admin")!).pathname).toBe("/admin");
    },
  );

  it("sends an administrator to the panel rather than the feed", () => {
    // An admin has no feed, profile or matches, so the generic /feed redirect
    // would land them on a page built for a role they do not have.
    expect(new URL(redirectLocation("/", "admin")!).pathname).toBe("/admin");
    expect(new URL(redirectLocation("/login", "admin")!).pathname).toBe(
      "/admin",
    );
  });

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
