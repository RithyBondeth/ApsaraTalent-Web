import React from "react";
import { describe, expect, it } from "vitest";
import { getAvailabilityStyleClass } from "./get-availability-class";
import { getStatusBadgeStyleClass } from "./get-interview-status-class";
import { getPaginationPages } from "./get-pagination-pages";
import { getRandomBadgeColor } from "./get-random-badge-color";
import { getSocialPlatformTypeIcon } from "./get-social-type";

describe("UI functions", () => {
  // These assert the token family each state maps to, not a specific hue.
  // Asserting on "green"/"amber" made the tests restate the palette, so any
  // colour change broke them without anything actually regressing.
  it("maps availability to distinct categorical tokens", () => {
    expect(getAvailabilityStyleClass("FULL_TIME")).toContain("category-teal");
    expect(getAvailabilityStyleClass("part time")).toContain("category-indigo");
    expect(getAvailabilityStyleClass("freelance")).toContain("category-violet");
    expect(getAvailabilityStyleClass("contract")).toContain("muted");

    // Availability is a category, so it must never borrow a status colour —
    // that is what keeps a real warning legible next to a "freelance" chip.
    const all = ["FULL_TIME", "part time", "freelance", "contract"].map(
      getAvailabilityStyleClass,
    );
    for (const classes of all) {
      expect(classes).not.toMatch(/success|warning|destructive|info/);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  it("maps interview states to distinct status tokens", () => {
    expect(getStatusBadgeStyleClass("accepted")).toContain("success");
    expect(getStatusBadgeStyleClass("declined")).toContain("destructive");
    expect(getStatusBadgeStyleClass("cancelled")).toContain("muted");
    expect(getStatusBadgeStyleClass("completed")).toContain("info");
    expect(getStatusBadgeStyleClass("pending")).toContain("warning");

    const states = [
      "accepted",
      "declined",
      "cancelled",
      "completed",
      "pending",
    ] as const;
    const all = states.map(getStatusBadgeStyleClass);
    expect(new Set(all).size).toBe(all.length);

    // Tokens resolve per theme on their own; a `dark:` variant here would mean
    // someone reintroduced a hand-maintained second palette.
    for (const classes of all) expect(classes).not.toContain("dark:");
  });

  it("builds bounded pagination windows", () => {
    expect(getPaginationPages({ currentPage: 1, totalPages: 0 })).toEqual([]);
    expect(
      getPaginationPages({
        currentPage: -2,
        totalPages: 5,
        maxVisiblePages: 2,
      }),
    ).toEqual([1, 2, "...", 5]);
    expect(getPaginationPages({ currentPage: 5, totalPages: 5 })).toEqual([5]);
    expect(getPaginationPages({ currentPage: 99, totalPages: 3 })).toEqual([3]);
  });

  it("returns deterministic badge colors and social icons", () => {
    expect(getRandomBadgeColor("React")).toBe(getRandomBadgeColor("React"));
    expect(getRandomBadgeColor("React")).toEqual({
      bg: expect.any(String),
      text: expect.any(String),
    });
    expect(React.isValidElement(getSocialPlatformTypeIcon("Github"))).toBe(
      true,
    );
    expect(getSocialPlatformTypeIcon("Unknown" as never)).toBeNull();
  });
});
