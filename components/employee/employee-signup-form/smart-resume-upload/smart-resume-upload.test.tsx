import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  parseResume: vi.fn(),
  reset: vi.fn(),
  toastError: vi.fn(),
  state: {
    loading: false,
    data: null as null | Record<string, unknown>,
  },
}));

vi.mock("@/stores/apis/auth/parse-resume.store", () => ({
  useParseResumeStore: () => ({
    loading: mocks.state.loading,
    data: mocks.state.data,
    parseResume: mocks.parseResume,
    reset: mocks.reset,
  }),
}));

vi.mock("sonner", () => ({ toast: { error: mocks.toastError } }));
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values?.count === undefined ? key : `${key}:${values.count}`,
}));

import SmartResumeUpload from "./index";

describe("SmartResumeUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.state.loading = false;
    mocks.state.data = null;
  });

  it("rejects non-PDF and oversized files before calling the parser", async () => {
    const { container } = render(<SmartResumeUpload onParsed={vi.fn()} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [new File(["hello"], "resume.txt", { type: "text/plain" })] },
    });
    const oversized = new File(["x"], "resume.pdf", { type: "application/pdf" });
    Object.defineProperty(oversized, "size", { value: 6 * 1024 * 1024 });
    fireEvent.change(input, { target: { files: [oversized] } });

    expect(mocks.toastError).toHaveBeenNthCalledWith(1, "smartUploadPdfOnly");
    expect(mocks.toastError).toHaveBeenNthCalledWith(2, "smartUploadFileTooLarge");
    expect(mocks.parseResume).not.toHaveBeenCalled();
  });

  it("parses a valid selected or dropped PDF and returns the extracted data", async () => {
    const parsed = { firstName: "Sophea", skills: ["TypeScript"] };
    const onParsed = vi.fn();
    mocks.parseResume.mockResolvedValue(parsed);
    const { container } = render(<SmartResumeUpload onParsed={onParsed} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const pdf = new File(["pdf"], "resume.pdf", { type: "application/pdf" });

    fireEvent.change(input, { target: { files: [pdf] } });
    await waitFor(() => expect(onParsed).toHaveBeenCalledWith(parsed));
    fireEvent.drop(screen.getByText("smartUploadTitle").closest("div.w-full")!, {
      dataTransfer: { files: [pdf] },
    });
    await waitFor(() => expect(mocks.parseResume).toHaveBeenCalledTimes(2));
  });

  it("shows parsed details, toggles them, and clears the result", async () => {
    mocks.state.data = {
      firstName: "Sophea",
      lastName: "Chan",
      email: "sophea@example.com",
      phone: "+85512345678",
      jobTitle: "Engineer",
      yearsOfExperience: "3 years",
      skills: ["TypeScript", "React"],
      experiences: [{}],
      educations: [{}],
      careerScopes: ["Software"],
    };
    const user = userEvent.setup();
    render(<SmartResumeUpload onParsed={vi.fn()} />);

    expect(screen.getByText("smartUploadSuccess:6")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /smartUploadShowDetails/ }));
    expect(screen.getByText("Sophea Chan")).toBeInTheDocument();
    expect(screen.getByText("smartUploadSkillCount:2")).toBeInTheDocument();
    await user.click(screen.getByTitle("smartUploadClear"));
    expect(mocks.reset).toHaveBeenCalledOnce();
  });

  it("renders a non-interactive analyzing state", () => {
    mocks.state.loading = true;
    render(<SmartResumeUpload onParsed={vi.fn()} />);
    expect(screen.getByText("smartUploadAnalyzing")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "smartUploadBrowse" })).not.toBeInTheDocument();
  });
});
