import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ProfileCompletionCard from "./profile-completion-card";
import { AvailabilityBadge } from "@/components/utils/data-display/availability-badge";
import { SearchErrorCard } from "@/components/search/search-error-card";

vi.mock("next-intl", () => ({
  useTranslations:
    (namespace: string) => (key: string, values?: Record<string, unknown>) => {
      if (namespace === "profile.completionFields") return `field:${key}`;
      if (key === "percentComplete") return `${values?.percentage}% complete`;
      return key;
    },
}));

describe("profile status components", () => {
  it("shows an incomplete profile, capped field list, and overflow count", () => {
    const { container } = render(
      <ProfileCompletionCard
        percentage={60}
        missingFields={
          ["avatar", "job", "skills", "location", "resume"] as never
        }
      />,
    );
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("field:avatar")).toBeInTheDocument();
    expect(screen.getByText("+1 missingInformation")).toBeInTheDocument();
    expect(
      container.querySelector('[style="width: 60%;"]'),
    ).toBeInTheDocument();
  });

  it("shows the complete profile state", () => {
    render(<ProfileCompletionCard percentage={100} missingFields={[]} />);
    expect(screen.getByText("complete")).toBeInTheDocument();
    expect(screen.queryByText("100%", { exact: true })).not.toBeInTheDocument();
  });

  // Asserts the token family, not the hue — see ui-functions.test.ts.
  it.each([
    ["FULL_TIME", "Full Time", "category-teal"],
    ["PART_TIME", "Part Time", "category-indigo"],
    ["FREELANCE", "Freelance", "category-violet"],
    ["CONTRACT", "Contract", "muted"],
  ])("renders %s availability", (availability, label, token) => {
    render(<AvailabilityBadge availability={availability} />);
    expect(screen.getByText(label).className).toContain(token);
  });

  // Moved here when getAvailabilityStyleClass — a second copy of this mapping
  // that four cards pasted into hand-written spans — was retired.
  it("keeps availability off the status ramp, with no two alike", () => {
    const classNames = ["FULL_TIME", "PART_TIME", "FREELANCE", "CONTRACT"].map(
      (availability) => {
        const { container } = render(
          <AvailabilityBadge availability={availability} />,
        );
        return container.querySelector("span")!.className;
      },
    );

    // A category must never borrow a status colour — that is what keeps a real
    // warning legible next to a "freelance" chip.
    for (const className of classNames) {
      expect(className).not.toMatch(/success|warning|destructive|info/);
    }
    expect(new Set(classNames).size).toBe(classNames.length);
  });

  it("renders a visible search failure", () => {
    const onRetry = vi.fn();
    render(
      <SearchErrorCard
        title="Could not search"
        description="Try again later"
        retryLabel="Try again"
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText("Could not search")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
