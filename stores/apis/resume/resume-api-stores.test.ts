import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCoverLetterPdfStore } from "./cover-letter-pdf.store";
import { useGenerateAiResumeStore } from "./generate-ai-resume.store";
import { useGenerateResumeStore } from "./generate-resume.store";
import { useGetAllTemplateStore } from "./get-all-template.store";
import { useInterviewPrepPdfStore } from "./interview-prep-pdf.store";

const axiosMocks = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));

vi.mock("@/lib/axios", () => ({ default: axiosMocks }));

describe("resume API stores", () => {
  beforeEach(() => {
    Object.values(axiosMocks).forEach((mock) => mock.mockReset());
    useCoverLetterPdfStore.setState({ loading: false, error: null, data: null });
    useGenerateAiResumeStore.setState({ loading: false, error: null });
    useGenerateResumeStore.setState({ loading: false, error: null, data: null });
    useGetAllTemplateStore.setState({ loading: false, error: null, templateData: null });
    useInterviewPrepPdfStore.setState({ loading: false, error: null, data: null });
  });

  it("generates a cover-letter PDF", async () => {
    const pdf = { filename: "cover-letter.pdf", mimeType: "application/pdf", data: "base64" };
    const payload = {
      employeeName: "Sokha",
      companyName: "Apsara",
      coverLetterText: "I would like to apply.",
      style: "professional",
    };
    axiosMocks.post.mockResolvedValueOnce({ data: pdf });

    await expect(
      useCoverLetterPdfStore.getState().generateCoverLetterPdf(payload),
    ).resolves.toBe(pdf);
    expect(axiosMocks.post).toHaveBeenCalledWith(expect.any(String), payload);
    expect(useCoverLetterPdfStore.getState()).toMatchObject({ data: pdf, loading: false });
  });

  it("generates an AI resume from structured data", async () => {
    const payload = { template: "modern", personalInfo: { firstname: "Sokha" } };
    const generated = { ...payload, summary: "Generated summary" };
    axiosMocks.post.mockResolvedValueOnce({ data: generated });

    await expect(
      useGenerateAiResumeStore.getState().generateAiResume(payload as never),
    ).resolves.toBe(generated);
    expect(axiosMocks.post).toHaveBeenCalledWith(
      expect.any(String),
      payload,
      expect.objectContaining({ timeout: expect.any(Number) }),
    );
    expect(useGenerateAiResumeStore.getState()).toMatchObject({ loading: false, error: null });
  });

  it("generates an AI resume from pasted text", async () => {
    const payload = { sourceText: "Five years of engineering experience", template: "classic" as const };
    const generated = { template: "classic", summary: "Engineer" };
    axiosMocks.post.mockResolvedValueOnce({ data: generated });

    await expect(
      useGenerateAiResumeStore.getState().generateAiResumeFromText(payload),
    ).resolves.toBe(generated);
    expect(axiosMocks.post).toHaveBeenCalledWith(
      expect.any(String),
      payload,
      expect.objectContaining({ timeout: expect.any(Number) }),
    );
  });

  it("builds a downloadable resume", async () => {
    const payload = { template: "modern" };
    const resume = { filename: "resume.pdf", mimeType: "application/pdf", data: "base64" };
    axiosMocks.post.mockResolvedValueOnce({ data: resume });

    await expect(
      useGenerateResumeStore.getState().generateResume(payload as never),
    ).resolves.toBe(resume);
    expect(axiosMocks.post).toHaveBeenCalledWith(
      expect.any(String),
      payload,
      expect.objectContaining({ responseType: "json", timeout: expect.any(Number) }),
    );
    expect(useGenerateResumeStore.getState().data).toBe(resume);
  });

  it("loads all resume templates", async () => {
    const templates = [{ id: "template-1", name: "Modern" }];
    axiosMocks.get.mockResolvedValueOnce({ data: templates });

    await useGetAllTemplateStore.getState().queryAllTemplates();

    expect(useGetAllTemplateStore.getState()).toMatchObject({
      templateData: templates,
      loading: false,
      error: null,
    });
  });

  it("generates an interview-preparation PDF", async () => {
    const pdf = { filename: "interview.pdf", mimeType: "application/pdf", data: "base64" };
    const payload = {
      interviewTitle: "Frontend interview",
      companyName: "Apsara",
      questions: [
        {
          question: "Describe a difficult project",
          questionKm: "សូមពិពណ៌នាគម្រោងលំបាកមួយ",
          category: "experience",
          tip: "Use the STAR format",
          tipKm: "ប្រើទម្រង់ STAR",
        },
      ],
    };
    axiosMocks.post.mockResolvedValueOnce({ data: pdf });

    await expect(
      useInterviewPrepPdfStore.getState().generateInterviewPrepPdf(payload),
    ).resolves.toBe(pdf);
    expect(useInterviewPrepPdfStore.getState()).toMatchObject({ data: pdf, error: null });
  });

  it("clears loading and exposes generation failures", async () => {
    axiosMocks.post.mockRejectedValueOnce(new Error("generation unavailable"));
    await expect(
      useGenerateResumeStore.getState().generateResume({} as never),
    ).rejects.toThrow("generation unavailable");
    expect(useGenerateResumeStore.getState()).toMatchObject({
      loading: false,
      error: "generation unavailable",
    });
  });
});
