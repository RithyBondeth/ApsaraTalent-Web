import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MatchingCompanyCard from "./matching-company-card";
import MatchingEmployeeCard from "./matching-employee-card";

vi.mock("@/components/matching/lazy-ai-actions", () => ({
  LazyAiMatchExplanationAction: () => <button>AI score</button>,
  LazyAiCoverLetterAction: () => <button>Cover letter</button>,
  LazyAiSkillGapAction: () => <button>Skill gap</button>,
}));
vi.mock("next-intl", () => ({
  useTranslations:
    (namespace: string) => (key: string, values?: Record<string, unknown>) => {
      if (namespace === "locations") return key;
      const labels: Record<string, string> = {
        unmatch: "Unmatch",
        unmatchConfirmTitle: `Unmatch ${values?.name ?? "user"}?`,
        unmatchConfirmDesc: "This removes the connection.",
        cancel: "Cancel",
        unmatchConfirm: "Yes, unmatch",
        schedule: "Schedule",
        chatNow: "Chat now",
        founded: `Founded ${values?.year ?? ""}`,
        memberCount: `${values?.count ?? 0} members`,
        positionCount: `${values?.count ?? 0} positions`,
      };
      return labels[key] ?? key;
    },
}));

const position = {
  id: "position-1",
  title: "Frontend Engineer",
  description: "Role description",
  type: "full-time",
  experience: "mid",
  education: "bachelor",
  skills: ["React"],
};

describe("matching cards", () => {
  beforeEach(() => vi.clearAllMocks());

  it("routes company actions and requires confirmation before unmatching", async () => {
    const onChat = vi.fn();
    const onSchedule = vi.fn();
    const onUnmatch = vi.fn();
    const user = userEvent.setup();
    render(
      <MatchingCompanyCard
        id="company-1"
        avatar=""
        name="Apsara Labs"
        industry="Technology"
        foundedYear={2020}
        description="Product company"
        openPosition={[position]}
        companySize={40}
        location="phnom-penh"
        onChatNowClick={onChat}
        onScheduleClick={onSchedule}
        onUnmatch={onUnmatch}
        employeeId="employee-1"
        employeeName="Dara"
        employeeSkills={["React"]}
      />,
    );

    expect(screen.getByRole("button", { name: "AI score" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Cover letter" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Skill gap" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Schedule" }));
    await user.click(screen.getByRole("button", { name: "Chat now" }));
    expect(onSchedule).toHaveBeenCalledOnce();
    expect(onChat).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: "Unmatch" }));
    expect(
      screen.getByRole("dialog", { name: "Unmatch Apsara Labs?" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onUnmatch).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Unmatch" }));
    await user.click(screen.getByRole("button", { name: "Yes, unmatch" }));
    expect(onUnmatch).toHaveBeenCalledOnce();
  });

  it("routes employee actions, cancels unmatch, and locks pending actions", async () => {
    const onChat = vi.fn();
    const onSchedule = vi.fn();
    const onUnmatch = vi.fn();
    const user = userEvent.setup();
    render(
      <MatchingEmployeeCard
        id="employee-1"
        avatar=""
        name="Dara Sok"
        username="dara"
        description="Frontend engineer"
        position="Engineer"
        experience="4 years"
        availability="available"
        location="phnom-penh"
        skills={["React"]}
        onChatNowClick={onChat}
        onScheduleClick={onSchedule}
        onUnmatch={onUnmatch}
        isChatLoading
        isUnmatching
        companyId="company-1"
      />,
    );

    expect(screen.getByRole("button", { name: "Chat now" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Unmatch" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Schedule" }));
    expect(onSchedule).toHaveBeenCalledOnce();
    expect(onChat).not.toHaveBeenCalled();
    expect(onUnmatch).not.toHaveBeenCalled();
  });

  it("confirms employee unmatch when actions are enabled", async () => {
    const onChat = vi.fn();
    const onUnmatch = vi.fn();
    const user = userEvent.setup();
    render(
      <MatchingEmployeeCard
        id="employee-1"
        avatar=""
        name="Dara Sok"
        username="dara"
        description="Frontend engineer"
        position="Engineer"
        experience="4 years"
        availability="available"
        location="phnom-penh"
        skills={["React"]}
        onChatNowClick={onChat}
        onUnmatch={onUnmatch}
        companyId="company-1"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Chat now" }));
    expect(onChat).toHaveBeenCalledOnce();
    await user.click(screen.getByRole("button", { name: "Unmatch" }));
    await user.click(screen.getByRole("button", { name: "Yes, unmatch" }));
    expect(onUnmatch).toHaveBeenCalledOnce();
  });
});
