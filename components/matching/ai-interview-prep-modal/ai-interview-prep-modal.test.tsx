import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  streamFetch: vi.fn(),
  generatePdf: vi.fn(),
  downloadFile: vi.fn(),
  startProgress: vi.fn(),
  stopProgress: vi.fn(),
}));

vi.mock("@/utils/functions/stream-fetch", () => ({
  streamFetch: mocks.streamFetch,
}));
vi.mock("@/stores/apis/resume/interview-prep-pdf.store", () => ({
  useInterviewPrepPdfStore: () => ({
    generateInterviewPrepPdf: mocks.generatePdf,
  }),
}));
vi.mock("@/hooks/utils/use-download-progress", () => ({
  useDownloadProgress: () => ({
    progress: 0,
    start: mocks.startProgress,
    stop: mocks.stopProgress,
  }),
}));
vi.mock("@/utils/functions/file", () => ({
  downloadBase64File: mocks.downloadFile,
}));
vi.mock("@/utils/constants/config.constant", () => ({
  MODAL_ANIMATION_DELAY_MS: 0,
}));
vi.mock("@/components/utils/dialogs/loading-dialog", () => ({
  default: () => null,
}));
vi.mock("@/components/utils/feedback/ai-quota-badge", () => ({
  AiQuotaBadge: () => <div>Quota badge</div>,
}));
vi.mock("./question-card", () => ({
  QuestionCard: ({
    item,
    index,
    tipLabel,
  }: {
    item: { question: string; category: string; tip: string };
    index: number;
    tipLabel: string;
  }) => (
    <article>
      <span>{index + 1}</span>
      <span>{item.category}</span>
      <span>{item.question}</span>
      <span>
        {tipLabel}: {item.tip}
      </span>
    </article>
  ),
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const labels: Record<string, string> = {
      interviewPrep: "Interview prep",
      aiInterviewPrep: `Interview prep for ${values?.name ?? ""}`,
      interviewPrepFailed: "Interview preparation failed",
      somethingWentWrong: "Something went wrong",
      tryAgain: "Try again",
      answerTip: "Answer tip",
      questionsBadge: `${values?.count ?? 0} questions`,
      questionsBadgeSoFar: `${values?.count ?? 0} questions so far`,
      generatingMoreQuestions: "Generating more questions",
      regenerateQuestions: "Regenerate questions",
      downloadPrepPdf: "Download prep PDF",
      downloadingPrepPdf: "Downloading prep PDF",
      interviewPrepPdfGenerating: "Generating interview PDF",
      interviewPrepPdfStep1: "Preparing",
      interviewPrepPdfStep2: "Formatting",
      interviewPrepPdfStep3: "Rendering",
      interviewPrepPdfStep4: "Finishing",
    };
    return labels[key] ?? key;
  },
}));

import { AiInterviewPrepModal } from "./index";

const props = {
  eid: "employee-1",
  cid: "company-1",
  companyName: "Apsara Labs",
  interviewTitle: "Senior Frontend Interview",
};

describe("AiInterviewPrepModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.generatePdf.mockResolvedValue({
      data: "pdf-data",
      mimeType: "application/pdf",
      filename: "interview-prep.pdf",
    });
  });

  it("parses fragmented NDJSON questions and ignores malformed records", async () => {
    mocks.streamFetch.mockImplementation(async (_url, _options, onEvent) => {
      onEvent({
        t: "chunk",
        v: '{"question":"Explain React render',
      });
      onEvent({
        t: "chunk",
        v:
          'ing","category":"React","tip":"Discuss reconciliation"}\n' +
          '{"question":"Missing tip"}\nnot-json\n' +
          '{"question":"How do you test UI","tip":"Describe user-focused tests"}',
      });
      onEvent({ t: "done" });
    });
    const user = userEvent.setup();
    render(<AiInterviewPrepModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Interview prep" }));

    expect(await screen.findByText("Explain React rendering")).toBeVisible();
    expect(screen.getByText("How do you test UI")).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.queryByText("Missing tip")).not.toBeInTheDocument();
    expect(screen.getByText("2 questions")).toBeVisible();
    expect(mocks.streamFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "interviewTitle=Senior%20Frontend%20Interview",
      ),
      { method: "GET" },
      expect.any(Function),
    );
  });

  it("surfaces quota errors and retries successfully", async () => {
    mocks.streamFetch
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "error", code: 429, v: "Daily AI limit reached" });
      })
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({
          t: "chunk",
          v: '{"question":"Why Apsara?","tip":"Connect your experience"}\n',
        });
        onEvent({ t: "done" });
      });
    const user = userEvent.setup();
    render(<AiInterviewPrepModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Interview prep" }));
    expect(await screen.findByText("Daily AI limit reached")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Why Apsara?")).toBeVisible();
    expect(mocks.streamFetch).toHaveBeenCalledTimes(2);
  });

  it("recovers after the streaming request rejects", async () => {
    mocks.streamFetch
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({
          t: "chunk",
          v: '{"question":"Tell me about yourself","tip":"Keep it concise"}\n',
        });
        onEvent({ t: "done" });
      });
    const user = userEvent.setup();
    render(<AiInterviewPrepModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Interview prep" }));
    expect(
      await screen.findByText("Interview preparation failed"),
    ).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Tell me about yourself")).toBeVisible();
  });

  it("generates and downloads a PDF from the streamed questions", async () => {
    mocks.streamFetch.mockImplementation(async (_url, _options, onEvent) => {
      onEvent({
        t: "chunk",
        v: '{"question":"Explain accessibility","category":"Quality","tip":"Mention WCAG"}\n',
      });
      onEvent({ t: "done" });
    });
    const user = userEvent.setup();
    render(<AiInterviewPrepModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Interview prep" }));
    await user.click(
      await screen.findByRole("button", { name: "Download prep PDF" }),
    );

    await waitFor(() =>
      expect(mocks.downloadFile).toHaveBeenCalledWith(
        "pdf-data",
        "application/pdf",
        "interview-prep.pdf",
      ),
    );
    expect(mocks.generatePdf).toHaveBeenCalledWith({
      interviewTitle: "Senior Frontend Interview",
      companyName: "Apsara Labs",
      questions: [
        {
          question: "Explain accessibility",
          questionKm: "",
          category: "Quality",
          tip: "Mention WCAG",
          tipKm: "",
        },
      ],
    });
    expect(mocks.startProgress).toHaveBeenCalledWith(92);
    expect(mocks.stopProgress).toHaveBeenCalledWith(100);
  });
});
