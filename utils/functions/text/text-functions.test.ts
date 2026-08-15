import { describe, expect, it, vi } from "vitest";
import { capitalizeWords } from "./capitalize-words";
import { formatAvailabilityWords } from "./format-availability-words";
import { formatSalaryRange } from "./format-salary-range";
import { getNameInitials } from "./get-name-initials";
import { translateLocation } from "./translate-location";

const salaryLabels = {
  from: (amount: string) => `From ${amount}`,
  upTo: (amount: string) => `Up to ${amount}`,
  negotiable: "Negotiable",
};

describe("text functions", () => {
  it("normalizes capitalization and enum labels", () => {
    expect(capitalizeWords("hELLO woRLD")).toBe("Hello World");
    expect(formatAvailabilityWords("FULL_TIME")).toBe("Full Time");
    expect(formatAvailabilityWords("")).toBe("");
  });

  it("creates bounded uppercase initials", () => {
    expect(getNameInitials("Sok Dara")).toBe("SD");
    expect(getNameInitials("sok dara vann")).toHaveLength(2);
  });

  it("translates known locations and preserves unknown values", () => {
    const t = vi.fn((key: string) => `translated:${key}`);
    expect(translateLocation("PHNOM PENH", t)).toBe("translated:phnomPenh");
    expect(translateLocation("Sihanoukville", t)).toBe(
      "translated:preahSihanouk",
    );
    expect(translateLocation("Somewhere", t)).toBe("Somewhere");
    expect(translateLocation(null, t)).toBe("");
  });

  describe("formatSalaryRange", () => {
    it("renders a full range with the currency symbol", () => {
      expect(
        formatSalaryRange(
          { salaryMin: 800, salaryMax: 1500, salaryCurrency: "USD" },
          salaryLabels,
        ),
      ).toBe("$800 – $1,500");
      expect(
        formatSalaryRange(
          { salaryMin: 800000, salaryMax: 2000000, salaryCurrency: "KHR" },
          salaryLabels,
        ),
      ).toBe("800,000៛ – 2,000,000៛");
    });

    // Postgres `numeric` columns come back as strings through TypeORM, so the
    // formatter sees "800.00" far more often than it sees 800.
    it("parses decimal strings and drops empty cents", () => {
      expect(
        formatSalaryRange(
          { salaryMin: "800.00", salaryMax: "1500.50", salaryCurrency: "USD" },
          salaryLabels,
        ),
      ).toBe("$800 – $1,500.50");
    });

    it("labels one-sided ranges", () => {
      expect(
        formatSalaryRange(
          { salaryMin: 800, salaryCurrency: "USD" },
          salaryLabels,
        ),
      ).toBe("From $800");
      expect(
        formatSalaryRange(
          { salaryMax: 1500, salaryCurrency: "USD" },
          salaryLabels,
        ),
      ).toBe("Up to $1,500");
    });

    it("collapses an equal min and max to a single amount", () => {
      expect(
        formatSalaryRange(
          { salaryMin: 1000, salaryMax: 1000, salaryCurrency: "USD" },
          salaryLabels,
        ),
      ).toBe("$1,000");
    });

    // Postings predating the structured columns only have the free-text string.
    it("falls back to the legacy salary string, then to negotiable", () => {
      expect(
        formatSalaryRange({ salary: "$500 - $900 monthly" }, salaryLabels),
      ).toBe("$500 - $900 monthly");
      expect(formatSalaryRange({}, salaryLabels)).toBe("Negotiable");
      expect(
        formatSalaryRange({ salary: "   ", salaryMin: null }, salaryLabels),
      ).toBe("Negotiable");
    });

    it("ignores zero and non-numeric amounts rather than rendering them", () => {
      expect(
        formatSalaryRange(
          { salaryMin: 0, salaryMax: "abc", salary: "Competitive" },
          salaryLabels,
        ),
      ).toBe("Competitive");
    });
  });
});
