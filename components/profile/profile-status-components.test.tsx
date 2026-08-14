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

  it.each([
    ["FULL_TIME", "Full Time", "green"],
    ["PART_TIME", "Part Time", "blue"],
    ["FREELANCE", "Freelance", "purple"],
    ["CONTRACT", "Contract", "muted"],
  ])("renders %s availability", (availability, label, color) => {
    render(<AvailabilityBadge availability={availability} />);
    expect(screen.getByText(label).className).toContain(color);
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
