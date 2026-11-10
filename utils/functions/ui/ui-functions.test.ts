import { describe, expect, it } from "vitest";
import { getApplicationStatusClass } from "./get-application-status-class";
import { getStatusBadgeStyleClass } from "./get-interview-status-class";
import { getPaginationPages } from "./get-pagination-pages";
import { getScoreTone } from "./get-score-tone";

describe("UI functions", () => {
  // These assert the token family each state maps to, not a specific hue.
  // Asserting on "green"/"amber" made the tests restate the palette, so any
  // colour change broke them without anything actually regressing.
  it("maps a match score to status tokens, with a weak match kept neutral", () => {
    expect(getScoreTone(90).text).toContain("success");
    expect(getScoreTone(60).text).toContain("warning");

    // A low score is not an error — rendering a person in red reads far worse
    // than it scores — so the weak band is muted rather than destructive.
    expect(getScoreTone(20).text).toContain("muted");
    expect(getScoreTone(20).text).not.toContain("destructive");

    // Boundaries, and no raw hex anywhere: these used to be inline #22c55e /
    // #f59e0b / #ef4444, which failed AA on a light card and no gate could see.
    expect(getScoreTone(75).text).toContain("success");
    expect(getScoreTone(74).text).toContain("warning");
    expect(getScoreTone(50).text).toContain("warning");
    expect(getScoreTone(49).text).toContain("muted");
    for (const score of [90, 60, 20]) {
      expect(JSON.stringify(getScoreTone(score))).not.toMatch(
        /#[0-9a-f]{3,6}/i,
      );
    }
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

  it("spends a status colour only on application stages that need one", () => {
    expect(getApplicationStatusClass("hired")).toContain("success");
    expect(getApplicationStatusClass("rejected")).toContain("destructive");

    // Progress stages share the info family. They are told apart by their
    // label, not by borrowing `warning` — a category must never be mistakable
    // for a state.
    for (const stage of ["shortlisted", "interviewing", "offered"] as const) {
      expect(getApplicationStatusClass(stage)).toContain("info");
    }

    // An application nobody has moved yet is the resting condition, not a
    // warning. Painting the whole inbox amber is what stops a real warning
    // from being seen.
    for (const stage of ["pending", "reviewed", "withdrawn"] as const) {
      const classes = getApplicationStatusClass(stage);
      expect(classes).toContain("muted");
      expect(classes).not.toContain("warning");
      expect(classes).not.toContain("destructive");
    }
  });
});
