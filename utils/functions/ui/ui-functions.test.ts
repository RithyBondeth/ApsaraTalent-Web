import React from "react";
import { describe, expect, it } from "vitest";
import { getAvailabilityStyleClass } from "./get-availability-class";
import { getStatusBadgeStyleClass } from "./get-interview-status-class";
import { getPaginationPages } from "./get-pagination-pages";
import { getRandomBadgeColor } from "./get-random-badge-color";
import { getSocialPlatformTypeIcon } from "./get-social-type";

describe("UI functions", () => {
  it("maps availability and interview states to semantic styles", () => {
    expect(getAvailabilityStyleClass("FULL_TIME")).toContain("green");
    expect(getAvailabilityStyleClass("part time")).toContain("blue");
    expect(getAvailabilityStyleClass("freelance")).toContain("purple");
    expect(getAvailabilityStyleClass("contract")).toContain("muted");
    expect(getStatusBadgeStyleClass("accepted")).toContain("emerald");
    expect(getStatusBadgeStyleClass("declined")).toContain("red");
    expect(getStatusBadgeStyleClass("cancelled")).toContain("gray");
    expect(getStatusBadgeStyleClass("completed")).toContain("blue");
    expect(getStatusBadgeStyleClass("pending")).toContain("amber");
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
