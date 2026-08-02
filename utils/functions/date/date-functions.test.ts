import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDateForField } from "./format-date-for-field";
import { formatDisplayDate } from "./format-display-date";
import { formatDurationClock } from "./format-duration";
import { formatShortDate } from "./format-short-date";
import {
  formatMessageTime,
  formatSidebarTime,
  getDateDividerLabel,
  parseMessageDate,
} from "./message-date";
import { parseMaybeDate } from "./parse-maybe-date";
import { timeAgo } from "./time-ago";

describe("date functions", () => {
  afterEach(() => vi.useRealTimers());

  it("formats dates for fields, display text, and short labels", () => {
    const localDate = new Date(2024, 1, 3);
    expect(formatDateForField(localDate)).toBe("2024-02-03");
    expect(formatDisplayDate("03/02/2024")).toBe("February 3rd, 2024");
    expect(formatDisplayDate("11/02/2024")).toBe("February 11th, 2024");
    expect(formatDisplayDate("2024-02-22T00:00:00")).toBe("February 22nd, 2024");
    expect(formatShortDate("2024-02-03T12:00:00")).toContain("Feb");
  });

  it("handles missing and invalid display dates", () => {
    expect(formatDisplayDate(" ")).toBe("Not specified");
    expect(() => formatDisplayDate("99/99/2024")).toThrow("Invalid date format");
    expect(() => formatDisplayDate("1/2")).toThrow("Invalid date format");
    expect(() => formatDisplayDate("not-a-date")).toThrow("Invalid date");
  });

  it("formats safe clock durations", () => {
    expect(formatDurationClock(125.9)).toBe("2:05");
    expect(formatDurationClock(5, { padMinutes: true })).toBe("00:05");
    expect(formatDurationClock(-4)).toBe("0:00");
    expect(formatDurationClock(Number.NaN)).toBe("0:00");
  });

  it("parses optional and message dates safely", () => {
    expect(parseMaybeDate(null)).toBeUndefined();
    expect(parseMaybeDate("bad")).toBeUndefined();
    expect(parseMaybeDate("03/02/2024")).toEqual(new Date(2024, 1, 3));
    expect(parseMaybeDate("2024-02-03")?.getFullYear()).toBe(2024);

    const valid = new Date("2024-02-03T01:02:03Z");
    expect(parseMessageDate(valid)).toBe(valid);
    expect(parseMessageDate("2024-02-03T01:02:03").toISOString()).toBe(
      "2024-02-03T01:02:03.000Z",
    );
    expect(parseMessageDate(Number.NaN).getTime()).not.toBeNaN();
    expect(parseMessageDate(new Date("bad")).getTime()).not.toBeNaN();
    expect(formatMessageTime(valid)).toMatch(/\d{1,2}:\d{2}/);
  });

  it("labels sidebar and divider dates across time ranges", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 5, 15, 12));
    expect(formatSidebarTime(new Date(2025, 5, 15, 9))).toMatch(/9:00/);
    expect(formatSidebarTime(new Date(2025, 5, 14, 9))).toBe("Yesterday");
    expect(formatSidebarTime(new Date(2025, 4, 1))).toContain("May");
    expect(formatSidebarTime(new Date(2024, 4, 1))).toMatch(/May.*24/);
    expect(getDateDividerLabel(new Date(2025, 5, 15))).toBe("Today");
    expect(getDateDividerLabel(new Date(2025, 5, 14))).toBe("Yesterday");
    expect(getDateDividerLabel(new Date(2024, 4, 1))).toContain("2024");
  });

  it("describes every relative-time bucket and supports translation", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));
    const ago = (milliseconds: number) =>
      new Date(Date.now() - milliseconds).toISOString();

    expect(timeAgo(undefined)).toBe("");
    expect(timeAgo("invalid")).toBe("");
    expect(timeAgo(ago(10_000))).toBe("just now");
    expect(timeAgo(ago(60_000))).toBe("1 minute ago");
    expect(timeAgo(ago(2 * 60_000))).toBe("2 minutes ago");
    expect(timeAgo(ago(60 * 60_000))).toBe("1 hour ago");
    expect(timeAgo(ago(24 * 60 * 60_000))).toBe("1 day ago");
    expect(timeAgo(ago(7 * 24 * 60 * 60_000))).toBe("1 week ago");
    expect(timeAgo(ago(31 * 24 * 60 * 60_000))).toBe("1 month ago");
    expect(timeAgo(ago(366 * 24 * 60 * 60_000))).toBe("1 year ago");
    expect(timeAgo(ago(2 * 60_000), (key, values) => `${key}:${values?.count}`)).toBe(
      "timeAgoMinutes:2",
    );
  });
});
