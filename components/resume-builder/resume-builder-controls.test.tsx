import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ResumeBuilderGenerate from "./generate";
import ResumeSourceInput from "./source-input";
import TemplateCard from "./template";

vi.mock("next-intl", () => ({
  useTranslations: () => (
    key: string,
    values?: Record<string, string | number>,
  ) =>
    ({
      pasteInfoTitle: "Paste information",
      pasteInfoDescription: "Paste source information",
      pasteInfoLabel: "Resume source",
      pasteInfoPlaceholder: "Paste your experience",
      pasteInfoPrivacy: "Private",
      usingPastedInfo: "Using pasted information",
      usingProfileInfo: "Using profile information",
      useProfileInstead: "Use profile instead",
      pasteInfoCharacterCount: `${values?.count}/${values?.max}`,
      templateLabel: "Template",
      selectTemplateFirst: "Select a template first",
      generateDesc: "Generate a résumé",
      preparingResume: "Preparing résumé",
      generateMyResume: "Generate my résumé",
      selectedTemplate: "Selected",
      useTemplate: "Use template",
      preview: "Preview",
    })[key] ?? key,
}));

vi.mock("@/components/utils/feedback/ai-quota-badge", () => ({
  AiQuotaBadge: () => <div>AI quota</div>,
}));

vi.mock("@/components/resume-builder/template/mini-preview", () => ({
  TemplateMiniPreview: () => <div>Template preview</div>,
}));

describe("résumé builder controls", () => {
  it("switches between profile and pasted information", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <ResumeSourceInput value="" onChange={onChange} maxLength={40} />,
    );

    expect(screen.getByText("Using profile information")).toBeInTheDocument();
    const source = screen.getByLabelText("Resume source");
    await user.type(source, "Experienced engineer");
    expect(onChange).toHaveBeenCalled();

    rerender(
      <ResumeSourceInput
        value="Experienced engineer"
        onChange={onChange}
        maxLength={40}
      />,
    );
    expect(screen.getByText("Using pasted information")).toBeInTheDocument();
    expect(screen.getByText("20/40")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Use profile instead" }));
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("prevents generation until a template is selected", async () => {
    const user = userEvent.setup();
    const onGenerateClick = vi.fn();
    const { rerender } = render(
      <ResumeBuilderGenerate
        disabled
        loading={false}
        onGenerateClick={onGenerateClick}
        selectedTemplate={null}
        selectedTemplateLabel={null}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Generate my résumé/ }),
    ).toBeDisabled();
    expect(screen.getByText("Select a template first")).toBeInTheDocument();

    rerender(
      <ResumeBuilderGenerate
        disabled={false}
        loading={false}
        onGenerateClick={onGenerateClick}
        selectedTemplate="modern"
        selectedTemplateLabel="Modern"
      />,
    );
    await user.click(screen.getByRole("button", { name: /Generate my résumé/ }));
    expect(onGenerateClick).toHaveBeenCalledOnce();
  });

  it("exposes the loading state while generation is in progress", () => {
    render(
      <ResumeBuilderGenerate
        disabled
        loading
        onGenerateClick={vi.fn()}
        selectedTemplate="modern"
        selectedTemplateLabel="Modern"
      />,
    );

    expect(
      screen.getByRole("button", { name: /Preparing résumé/ }),
    ).toBeDisabled();
  });

  it("selects a template from its action button", async () => {
    const user = userEvent.setup();
    const onUseTemplate = vi.fn();
    render(
      <TemplateCard
        templateKey="modern"
        image=""
        title="Modern"
        description="A clean layout"
        selected={false}
        onUseTemplate={onUseTemplate}
      />,
    );

    expect(screen.getByText("Template preview")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Use template/ }));
    expect(onUseTemplate).toHaveBeenCalledOnce();
  });
});
