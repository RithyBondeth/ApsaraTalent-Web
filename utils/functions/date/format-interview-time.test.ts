import { describe, expect, it } from "vitest";
import { formatInterviewTime } from "./format-interview-time";

describe("formatInterviewTime", () => {
  const scheduledAt = "2026-08-14T07:00:00.000Z";

  it("returns just the reader's local time when no origin timezone is stored", () => {
    // Legacy interview rows have null. One prominent time, no clutter.
    const out = formatInterviewTime(scheduledAt, null);
    expect(out).not.toContain("·");
  });

  it("returns just the reader's local time when the timezone renders identically", () => {
    // Bangkok and Ho_Chi_Minh are both UTC+7 today. Showing both when they
    // look identical to the reader adds noise, not clarity.
    const readerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const out = formatInterviewTime(scheduledAt, readerZone);
    expect(out).not.toContain("·");
  });

  it("appends the origin time when it differs from the reader's zone", () => {
    // The dev machine and CI can be in any timezone. `Etc/GMT+12` (UTC-12)
    // has essentially no inhabited land and is not any common CI or dev host,
    // so it is guaranteed to differ from whichever zone is running the test.
    const out = formatInterviewTime(scheduledAt, "Etc/GMT+12");
    expect(out).toContain("Etc/GMT+12");
    expect(out).toContain(" · ");
  });

  it("falls back to the reader's local time when the timezone is bogus", () => {
    // A bad IANA name must not blank the interview time out; the reader
    // still sees when it is, they just do not see the origin trailer.
    const out = formatInterviewTime(scheduledAt, "Not/A_Real/Timezone");
    expect(out).not.toContain("Not/A_Real/Timezone");
  });
});
