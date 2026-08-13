import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  streamFetch: vi.fn(),
  generatePdf: vi.fn(),
  downloadFile: vi.fn(),
}));

vi.mock("@/utils/functions/network/stream-fetch", () => ({
  streamFetch: mocks.streamFetch,
}));
vi.mock("@/stores/apis/resume/cover-letter-pdf.store", () => ({
  useCoverLetterPdfStore: () => ({ generateCoverLetterPdf: mocks.generatePdf }),
}));
vi.mock("@/hooks/utils/use-download-progress", () => ({
  useDownloadProgress: () => ({
    progress: 0,
    start: vi.fn(),
    stop: vi.fn(),
  }),
}));
vi.mock("@/utils/functions/file", () => ({
  downloadBase64File: mocks.downloadFile,
}));
vi.mock("@/components/utils/dialogs/loading-dialog", () => ({
  default: () => null,
}));
vi.mock("@/components/utils/feedback/ai-quota-badge", () => ({
  AiQuotaBadge: () => <div>Quota badge</div>,
}));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const labels: Record<string, string> = {
      coverLetter: "Cover letter",
      aiCoverLetter: "AI cover letter",
      coverLetterFailed: "Cover letter failed",
      polishFailed: "Polish failed",
      generating: "Generating",
      regenerate: "Regenerate",
      polish: "Polish",
      polishing: "Polishing",
      copy: "Copy",
      copied: "Copied",
      downloadPdf: "Download PDF",
      coverLetterPdfFailed: "Failed to generate PDF. Please try again.",
      styleLabel: "Style",
    };
    return labels[key] ?? key;
  },
}));

import { AiCoverLetterModal } from "./index";

const props = {
  employeeName: "Dara",
  employeeJob: "Engineer",
  employeeSkills: ["React"],
  employeeExperience: "4 years",
  employeeDescription: "Product engineer",
  companyName: "Apsara Labs",
  companyIndustry: "Technology",
  companyDescription: "A product company",
  openPositions: ["Frontend Engineer"],
};

describe("AiCoverLetterModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.generatePdf.mockResolvedValue({
      data: "pdf",
      mimeType: "application/pdf",
      filename: "letter.pdf",
    });
  });

  it("streams a letter and regenerates it with a fresh request", async () => {
    mocks.streamFetch
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: "First letter" });
        onEvent({ t: "done" });
      })
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: "Second letter" });
        onEvent({ t: "done" });
      });
    const user = userEvent.setup();
    render(<AiCoverLetterModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cover letter" }));
    expect(await screen.findByDisplayValue("First letter")).toBeVisible();
    expect(screen.getByText("Quota badge")).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Regenerate/ }));
    expect(await screen.findByDisplayValue("Second letter")).toBeVisible();
    expect(mocks.streamFetch).toHaveBeenCalledTimes(2);
  });

  it("surfaces quota errors and recovers from a rejected request", async () => {
    mocks.streamFetch
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "error", code: 429, v: "Daily AI limit reached" });
      })
      .mockRejectedValueOnce(new Error("offline"))
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: "Recovered letter" });
      });
    const user = userEvent.setup();
    render(<AiCoverLetterModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cover letter" }));
    expect(await screen.findByText("Daily AI limit reached")).toBeVisible();

    await user.click(screen.getByRole("button", { name: /Regenerate/ }));
    expect(await screen.findByText("Cover letter failed")).toBeVisible();
    expect(screen.getByRole("button", { name: /Regenerate/ })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: /Regenerate/ }));
    expect(await screen.findByDisplayValue("Recovered letter")).toBeVisible();
  });

  it("aborts an in-flight generation when the dialog closes", async () => {
    let requestSignal: AbortSignal | undefined;
    mocks.streamFetch.mockImplementation(
      (_url, options) =>
        new Promise<void>((resolve, reject) => {
          requestSignal = options.signal;
          options.signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
          void resolve;
        }),
    );
    const user = userEvent.setup();
    render(<AiCoverLetterModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cover letter" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(requestSignal?.aborted).toBe(true));
    expect(screen.queryByText("Cover letter failed")).not.toBeInTheDocument();
  });

  it("polishes, copies, and downloads the generated letter", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    mocks.streamFetch
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: "Draft letter" });
      })
      .mockImplementationOnce(async (_url, _options, onEvent) => {
        onEvent({ t: "chunk", v: "Polished letter" });
      });
    render(<AiCoverLetterModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cover letter" }));
    await user.click(await screen.findByRole("button", { name: /Polish/ }));
    expect(await screen.findByDisplayValue("Polished letter")).toBeVisible();

    await user.click(screen.getByTitle("Copy"));
    expect(writeText).toHaveBeenCalledWith("Polished letter");

    await user.click(screen.getByRole("button", { name: /Download PDF/ }));
    await waitFor(
      () => expect(mocks.downloadFile).toHaveBeenCalledWith(
        "pdf",
        "application/pdf",
        "letter.pdf",
      ),
      { timeout: 1000 },
    );
    expect(mocks.generatePdf).toHaveBeenCalledWith(
      expect.objectContaining({
        coverLetterText: "Polished letter",
        style: "classic",
      }),
    );
  });

  it("shows a recoverable error when PDF generation fails", async () => {
    mocks.streamFetch.mockImplementation(async (_url, _options, onEvent) => {
      onEvent({ t: "chunk", v: "Draft letter" });
    });
    mocks.generatePdf.mockRejectedValueOnce(new Error("PDF unavailable"));
    const user = userEvent.setup();
    render(<AiCoverLetterModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cover letter" }));
    await user.click(
      await screen.findByRole("button", { name: /Download PDF/ }),
    );
    expect(
      await screen.findByText("Failed to generate PDF. Please try again."),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /Download PDF/ })).not.toBeDisabled();
  });
});
