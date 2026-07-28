import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Request } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  loginEmployee,
  mockApi,
  successfulEmployeeApi,
} from "./helpers";

const currentUser = {
  id: "user-1",
  email: "candidate@example.com",
  role: "employee",
  createdAt: "2026-01-01T00:00:00.000Z",
  employee: {
    id: "employee-1",
    firstname: "Sophea",
    lastname: "Chan",
    username: "sophea.chan",
    gender: "female",
    phone: "012345678",
    email: "candidate@example.com",
    job: "Frontend Engineer",
    yearsOfExperience: "4",
    availability: "full_time",
    description: "Product-focused frontend engineer",
    location: "Phnom Penh",
    skills: [{ id: "skill-1", name: "React" }],
    experiences: [],
    educations: [],
    socials: [],
    careerScopes: [],
  },
};

const company = {
  id: "company-1",
  name: "Apsara Labs",
  industry: "Technology",
  email: "hello@apsara.test",
  description: "A Cambodian product engineering company",
  avatar: "",
  companySize: 45,
  foundedYear: 2020,
  location: "Phnom Penh",
  phone: "023123456",
  openPositions: [
    {
      id: "position-1",
      title: "Frontend Engineer",
      description: "Build accessible interfaces",
      type: "full_time",
      experience: "mid",
      education: "bachelor",
      skills: ["React", "TypeScript"],
    },
  ],
  values: [],
  benefits: [],
  careerScopes: [],
  socials: [],
  skillScore: 86,
};

const validExplanation = {
  score: 86,
  verdict: "Strong match",
  explanation: "Your product experience aligns well with this team.",
  strengths: ["React", "Accessible UI"],
  gaps: ["GraphQL"],
};

type StreamMode = "success" | "quota" | "delayed";

type AiJourneyState = {
  coverCalls?: number;
  coverModes?: StreamMode[];
  explanationCalls?: number;
  explanationMalformedFirst?: boolean;
  pdfFailure?: boolean;
  pdfRequests?: number;
  polishCalls?: number;
  skillCalls?: number;
  skillModes?: Array<"success" | "quota">;
};

function sse(...events: Array<Record<string, unknown>>) {
  return events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("");
}

function streamResponse(...events: Array<Record<string, unknown>>) {
  return {
    contentType: "text/event-stream",
    headers: {
      "cache-control": "no-cache",
      connection: "keep-alive",
    },
    rawBody: sse(...events),
  };
}

function aiJourneyApi(state: AiJourneyState) {
  return async (request: Request) => {
    const pathname = new URL(request.url()).pathname;
    const method = request.method();

    if (pathname.endsWith("/user/current-user")) {
      return { body: currentUser };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/match/current-employee-matching/employee-1")
    ) {
      return { body: [company] };
    }

    if (
      method === "GET" &&
      pathname.endsWith("/match/ai-explanation/employee-1/company-1")
    ) {
      state.explanationCalls = (state.explanationCalls ?? 0) + 1;
      if (state.explanationMalformedFirst && state.explanationCalls === 1) {
        return {
          body: {
            score: 140,
            verdict: "Strong match",
            explanation: "Invalid payload",
            strengths: null,
            gaps: [],
          },
        };
      }
      return { body: validExplanation };
    }

    if (
      method === "POST" &&
      pathname.endsWith("/resume/cover-letter/stream")
    ) {
      state.coverCalls = (state.coverCalls ?? 0) + 1;
      const mode = state.coverModes?.shift() ?? "success";
      if (mode === "delayed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (mode === "quota") {
        return streamResponse({
          t: "error",
          v: "Daily AI limit reached",
          code: 429,
        });
      }
      return streamResponse(
        { t: "chunk", v: "Dear Apsara Labs,\n\n" },
        { t: "chunk", v: "I would love to join your product team." },
        { t: "done" },
      );
    }

    if (
      method === "POST" &&
      pathname.endsWith("/resume/polish-cover-letter/stream")
    ) {
      state.polishCalls = (state.polishCalls ?? 0) + 1;
      return streamResponse(
        { t: "chunk", v: "Dear Apsara Labs,\n\n" },
        {
          t: "chunk",
          v: "I am excited to contribute to your accessible product team.",
        },
        { t: "done" },
      );
    }

    if (
      method === "POST" &&
      pathname.endsWith("/resume/cover-letter-pdf")
    ) {
      state.pdfRequests = (state.pdfRequests ?? 0) + 1;
      if (state.pdfFailure) {
        return { status: 503, body: { message: "PDF service unavailable" } };
      }
      return {
        body: {
          data: "cGRm",
          mimeType: "application/pdf",
          filename: "cover-letter.pdf",
        },
      };
    }

    if (
      method === "GET" &&
      pathname.endsWith(
        "/match/ai-skill-gap/employee-1/company-1/stream",
      )
    ) {
      state.skillCalls = (state.skillCalls ?? 0) + 1;
      const mode = state.skillModes?.shift() ?? "success";
      if (mode === "quota") {
        return streamResponse({
          t: "error",
          v: "Daily AI limit reached",
          code: 429,
        });
      }
      const records = [
        JSON.stringify({ t: "matched", skill: "React" }),
        JSON.stringify({
          t: "missing",
          skill: "Invalid GraphQL",
          criticality: "urgent",
        }),
        JSON.stringify({
          t: "missing",
          skill: "TypeScript",
          criticality: "medium",
          positions: ["Frontend Engineer"],
          tip: "Practice advanced types",
        }),
        JSON.stringify({
          t: "summary",
          overallGap: "small",
          estimatedWeeks: 3,
          topPriority: "Learn TypeScript",
        }),
      ].join("\n");
      return streamResponse(
        { t: "chunk", v: `${records}\n` },
        { t: "done" },
      );
    }

    return successfulEmployeeApi(request);
  };
}

test.describe("AI matching journeys", () => {
  test("loads, caches, and re-analyzes a match explanation", async ({ page }) => {
    const state: AiJourneyState = {};
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "AI Score" }).click();
    await expect(page.getByText("Strong match")).toBeVisible();
    await expect(
      page.getByText("Your product experience aligns well with this team."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "AI Score" }).click();
    await expect(page.getByText("Strong match")).toBeVisible();
    expect(state.explanationCalls).toBe(1);

    await page.getByRole("button", { name: "Re-analyze" }).click();
    await expect.poll(() => state.explanationCalls).toBe(2);
  });

  test("rejects a malformed explanation and recovers on retry", async ({
    page,
  }) => {
    const state: AiJourneyState = { explanationMalformedFirst: true };
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "AI Score" }).click();
    await expect(
      page.getByText("Failed to load AI analysis. Please try again."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Try Again" }).click();
    await expect(page.getByText("Strong match")).toBeVisible();
    expect(state.explanationCalls).toBe(2);
  });

  test("generates, polishes, copies, and reports PDF failures", async ({
    page,
  }) => {
    const state: AiJourneyState = { pdfFailure: true };
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            sessionStorage.setItem("e2e-copied-text", text);
          },
        },
      });
    });
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Cover Letter" }).click();
    const editor = page.getByRole("textbox");
    await expect(editor).toHaveValue(
      "Dear Apsara Labs,\n\nI would love to join your product team.",
    );
    await page.getByRole("button", { name: "Polish" }).click();
    await expect(editor).toHaveValue(
      "Dear Apsara Labs,\n\nI am excited to contribute to your accessible product team.",
    );
    await page.getByTitle("Copy").click();
    await expect
      .poll(() =>
        page.evaluate(() => sessionStorage.getItem("e2e-copied-text")),
      )
      .toContain("accessible product team");

    await page.getByRole("button", { name: "Download PDF" }).click();
    await expect(
      page.getByText("Failed to generate PDF. Please try again."),
    ).toBeVisible();
    expect(state.polishCalls).toBe(1);
    expect(state.pdfRequests).toBe(1);
  });

  test("surfaces cover-letter quota exhaustion and retries", async ({ page }) => {
    const state: AiJourneyState = { coverModes: ["quota", "success"] };
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Cover Letter" }).click();
    await expect(page.getByText("Daily AI limit reached")).toBeVisible();
    await page.getByRole("button", { name: "Regenerate" }).click();
    await expect(page.getByRole("textbox")).toHaveValue(
      /I would love to join your product team\./,
    );
    expect(state.coverCalls).toBe(2);
  });

  test("cancels an in-flight cover-letter request when closed", async ({
    page,
  }) => {
    const state: AiJourneyState = { coverModes: ["delayed"] };
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Cover Letter" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.waitForTimeout(1100);
    await expect(
      page.getByText("Failed to generate cover letter. Please try again."),
    ).not.toBeVisible();
    expect(state.coverCalls).toBe(1);
  });

  test("renders valid skill-gap records and ignores malformed records", async ({
    page,
  }) => {
    const state: AiJourneyState = {};
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Skill Gap" }).click();
    await expect(page.getByText("React")).toBeVisible();
    await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
    await expect(page.getByText("Learn TypeScript")).toBeVisible();
    await expect(page.getByText("Invalid GraphQL")).not.toBeVisible();
    expect(state.skillCalls).toBe(1);
  });

  test("surfaces skill-gap quota exhaustion and retries", async ({ page }) => {
    const state: AiJourneyState = { skillModes: ["quota", "success"] };
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await page.getByRole("button", { name: "Skill Gap" }).click();
    await expect(page.getByText("Daily AI limit reached")).toBeVisible();
    await page.getByRole("button", { name: "Try Again" }).click();
    await expect(page.getByText("TypeScript", { exact: true })).toBeVisible();
    expect(state.skillCalls).toBe(2);
  });

  test("AI dialogs are accessible and return focus to their trigger", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "The dialog accessibility audit runs once",
    );
    await mockApi(page, aiJourneyApi({}));
    await loginEmployee(page, "/matching");
    const trigger = page.getByRole("button", { name: "AI Score" });

    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page })
      .include('[role="dialog"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("@mobile generates a cover letter without layout overflow", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "The mobile journey uses the Pixel viewport",
    );
    const state: AiJourneyState = {};
    await mockApi(page, aiJourneyApi(state));
    await loginEmployee(page, "/matching");

    await expectNoHorizontalOverflow(page);
    await page.getByRole("button", { name: "Cover Letter" }).click();
    await expect(page.getByRole("textbox")).toHaveValue(
      /I would love to join your product team\./,
    );
    await expectNoHorizontalOverflow(page);
    expect(state.coverCalls).toBe(1);
  });
});
