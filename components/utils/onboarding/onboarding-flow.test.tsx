import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ONBOARDING_STORAGE_KEY } from "@/utils/constants/config.constant";
import { OnboardingFlow } from "./onboarding-flow";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      step1Title: "Welcome",
      step1Desc: "Browse matches",
      step2Title: "Like profiles",
      step2Desc: "Request a match",
      step3Title: "Save profiles",
      step3Desc: "Review favorites",
      step4Title: "Track matches",
      step4Desc: "Start conversations",
      next: "Next",
      getStarted: "Get started",
    })[key] ?? key,
}));

describe("OnboardingFlow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("reveals the tour, moves through every step, and persists completion", async () => {
    render(<OnboardingFlow />);
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();

    await act(async () => vi.advanceTimersByTime(1_200));
    expect(screen.getByText("Welcome")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to onboarding step 1" }),
    ).toHaveAttribute("aria-current", "step");

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Like profiles")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Go to onboarding step 4" }),
    );
    expect(screen.getByText("Track matches")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Get started" }));
    await act(async () => vi.advanceTimersByTime(250));

    expect(screen.queryByText("Track matches")).not.toBeInTheDocument();
    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe("1");
  });

  it("does not reopen after completion and supports explicit dismissal", async () => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    const { rerender } = render(<OnboardingFlow />);
    await act(async () => vi.advanceTimersByTime(2_000));
    expect(screen.queryByText("Welcome")).not.toBeInTheDocument();

    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    rerender(<></>);
    rerender(<OnboardingFlow />);
    await act(async () => vi.advanceTimersByTime(1_200));
    fireEvent.click(screen.getByRole("button", { name: "Close onboarding" }));
    await act(async () => vi.advanceTimersByTime(250));
    expect(localStorage.getItem(ONBOARDING_STORAGE_KEY)).toBe("1");
  });
});
