import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  streamFetch: vi.fn(),
}));

vi.mock("@/utils/functions/stream-fetch", () => ({
  streamFetch: mocks.streamFetch,
}));
vi.mock("@/components/utils/feedback/ai-quota-badge", () => ({
  AiQuotaBadge: () => <div>Quota badge</div>,
}));
vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      skillGap: "Skill gap",
      aiSkillGap: "AI skill gap",
      skillGapFailed: "Skill gap failed",
      somethingWentWrong: "Something went wrong",
      tryAgain: "Try again",
      matchedSkills: "Matched skills",
      missingSkills: "Missing skills",
      criticalityHigh: "High",
      criticalityMedium: "Medium",
      criticalityLow: "Low",
      neededFor: "Needed for",
      learningTip: "Learning tip",
      skillGapSummary: "Summary",
      gapSmall: "Small gap",
      estimatedTime: `${values?.weeks ?? 0} weeks`,
    };
    return labels[key] ?? key;
  },
}));

import { AiSkillGapModal } from "./index";

describe("AiSkillGapModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders valid streamed records and ignores malformed records", async () => {
    mocks.streamFetch.mockImplementation(async (_url, _options, onEvent) => {
      onEvent({
        t: "chunk",
        v:
          '{"t":"matched","skill":"React"}\n' +
          '{"t":"missing","skill":"GraphQL","criticality":"high"}\n' +
          '{"t":"missing","skill":"TypeScript","criticality":"medium","positions":["Frontend"],"tip":"Practice types"}\n' +
          '{"t":"summary","overallGap":"impossible","estimatedWeeks":"soon","topPriority":false}\n' +
          '{"t":"summary","overallGap":"small","estimatedWeeks":3,"topPriority":"Learn TypeScript"}\n',
      });
      onEvent({ t: "done" });
    });
    const user = userEvent.setup();
    render(
      <AiSkillGapModal
        eid="employee-1"
        cid="company-1"
        companyName="Apsara Labs"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Skill gap" }));
    expect(await screen.findByText("React")).toBeVisible();
    expect(screen.getByText("TypeScript")).toBeVisible();
    expect(screen.getByText("Small gap")).toBeVisible();
    expect(screen.getByText("Learn TypeScript")).toBeVisible();
    expect(screen.queryByText("GraphQL")).not.toBeInTheDocument();
  });

  it("shows quota errors and retries successfully", async () => {
    mocks.streamFetch
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "error", code: 429, v: "Daily AI limit reached" });
      })
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: '{"t":"matched","skill":"React"}\n' });
        onEvent({ t: "done" });
      });
    const user = userEvent.setup();
    render(
      <AiSkillGapModal
        eid="employee-1"
        cid="company-1"
        companyName="Apsara Labs"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Skill gap" }));
    expect(await screen.findByText("Daily AI limit reached")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("React")).toBeVisible();
    expect(mocks.streamFetch).toHaveBeenCalledTimes(2);
  });
});
