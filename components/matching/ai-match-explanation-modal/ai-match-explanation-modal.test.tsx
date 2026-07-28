import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fetchMatchExplanation: vi.fn(),
}));

vi.mock("@/stores/apis/matching/ai-match-explanation.store", () => ({
  useAiMatchExplanationStore: () => ({
    fetchMatchExplanation: mocks.fetchMatchExplanation,
  }),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      aiScore: "AI score",
      aiMatchAnalysis: "AI match analysis",
      analysisFailed: "Analysis failed",
      tryAgain: "Try again",
      strengths: "Strengths",
      gaps: "Gaps",
      vsCompany: `Compared with ${values?.name ?? "company"}`,
      reanalyze: "Reanalyze",
    };
    return labels[key] ?? key;
  },
}));

import { AiMatchExplanationModal } from "./index";

const validResponse = {
  score: 84,
  verdict: "Strong match",
  explanation: "Your experience fits this team.",
  strengths: ["React", "Communication"],
  gaps: ["GraphQL"],
};

describe("AiMatchExplanationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.fetchMatchExplanation.mockResolvedValue(validResponse);
  });

  it("loads and caches a valid explanation", async () => {
    const user = userEvent.setup();
    render(
      <AiMatchExplanationModal
        eid="employee-1"
        cid="company-1"
        companyName="Apsara Labs"
      />,
    );

    await user.click(screen.getByRole("button", { name: "AI score" }));
    expect(await screen.findByText("Strong match")).toBeVisible();
    expect(screen.getByText("Your experience fits this team.")).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(mocks.fetchMatchExplanation).toHaveBeenCalledWith(
      "employee-1",
      "company-1",
      "en",
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    await user.click(screen.getByRole("button", { name: "AI score" }));
    expect(await screen.findByText("Strong match")).toBeVisible();
    expect(mocks.fetchMatchExplanation).toHaveBeenCalledOnce();
  });

  it("rejects malformed responses and recovers on retry", async () => {
    mocks.fetchMatchExplanation
      .mockResolvedValueOnce({
        score: 120,
        verdict: "Strong",
        explanation: "Bad score",
        strengths: null,
        gaps: [],
      })
      .mockResolvedValueOnce(validResponse);
    const user = userEvent.setup();
    render(
      <AiMatchExplanationModal
        eid="employee-1"
        cid="company-1"
        companyName="Apsara Labs"
      />,
    );

    await user.click(screen.getByRole("button", { name: "AI score" }));
    expect(await screen.findByText("Analysis failed")).toBeVisible();
    expect(screen.queryByText("Bad score")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(screen.getByText("Strong match")).toBeVisible());
    expect(mocks.fetchMatchExplanation).toHaveBeenCalledTimes(2);
  });
});
