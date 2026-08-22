import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  LazyAiCoverLetterAction,
  LazyAiInterviewPrepAction,
  LazyAiMatchExplanationAction,
  LazyAiSkillGapAction,
} from "../lazy-ai-actions";

vi.mock("@/components/matching/ai-match-explanation-modal", () => ({
  AiMatchExplanationModal: ({ autoOpen }: { autoOpen?: boolean }) => (
    <div data-testid="match-modal">{String(autoOpen)}</div>
  ),
}));
vi.mock("@/components/matching/ai-cover-letter-modal", () => ({
  AiCoverLetterModal: ({ autoOpen }: { autoOpen?: boolean }) => (
    <div data-testid="cover-letter-modal">{String(autoOpen)}</div>
  ),
}));
vi.mock("@/components/matching/ai-skill-gap-modal", () => ({
  AiSkillGapModal: ({ autoOpen }: { autoOpen?: boolean }) => (
    <div data-testid="skill-gap-modal">{String(autoOpen)}</div>
  ),
}));
vi.mock("@/components/matching/ai-interview-prep-modal", () => ({
  AiInterviewPrepModal: ({ autoOpen }: { autoOpen?: boolean }) => (
    <div data-testid="interview-prep-modal">{String(autoOpen)}</div>
  ),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const labels: Record<string, string> = {
      aiScore: "AI score",
      coverLetter: "Cover letter",
      skillGap: "Skill gap",
      interviewPrep: "Interview prep",
    };
    return labels[key] ?? key;
  },
}));

describe("lazy AI actions", () => {
  it.each([
    {
      label: "AI score",
      testId: "match-modal",
      component: (
        <LazyAiMatchExplanationAction
          eid="employee-1"
          cid="company-1"
          companyName="Apsara"
        />
      ),
    },
    {
      label: "Cover letter",
      testId: "cover-letter-modal",
      component: (
        <LazyAiCoverLetterAction
          employeeName="Dara"
          employeeSkills={["React"]}
          companyName="Apsara"
          openPositions={["Engineer"]}
        />
      ),
    },
    {
      label: "Skill gap",
      testId: "skill-gap-modal",
      component: (
        <LazyAiSkillGapAction
          eid="employee-1"
          cid="company-1"
          companyName="Apsara"
        />
      ),
    },
    {
      label: "Interview prep",
      testId: "interview-prep-modal",
      component: (
        <LazyAiInterviewPrepAction
          eid="employee-1"
          cid="company-1"
          companyName="Apsara"
        />
      ),
    },
  ])(
    "loads $label on the first click",
    async ({ label, testId, component }) => {
      const user = userEvent.setup();
      render(component);

      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: label }));

      expect(await screen.findByTestId(testId)).toHaveTextContent("true");
    },
  );
});
