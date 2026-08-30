import { describe, expect, it } from "vitest";

import { resolveLandingRoute } from "./landing-route";

describe("resolveLandingRoute", () => {
  it.each(["employee", "company", "none"] as const)(
    "leaves the callback alone for a %s",
    (role) => {
      expect(resolveLandingRoute("/matching", role)).toBe("/matching");
    },
  );

  it("sends an administrator to the panel instead of the feed", () => {
    // Sign-in navigates on the client, so the middleware's role routing never
    // runs for it — this is the only thing standing between an admin and a
    // /feed built around a profile their role does not have.
    expect(resolveLandingRoute("/feed", "admin")).toBe("/admin");
  });

  it("discards a non-admin callback for an administrator", () => {
    expect(resolveLandingRoute("/profile/employee", "admin")).toBe("/admin");
  });

  it.each(["/admin", "/admin/users", "/admin/reports?status=pending"])(
    "honours an explicit admin callback (%s)",
    (target) => {
      // "You must sign in first" on a deep admin link has to return them to
      // the page they actually asked for.
      expect(resolveLandingRoute(target, "admin")).toBe(target);
    },
  );

  it("does not treat a lookalike prefix as an admin route", () => {
    expect(resolveLandingRoute("/administration", "admin")).toBe("/admin");
  });

  it("treats a missing role as non-admin", () => {
    expect(resolveLandingRoute("/feed", null)).toBe("/feed");
  });
});
