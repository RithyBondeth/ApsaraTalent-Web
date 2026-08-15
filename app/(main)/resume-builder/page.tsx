"use client";

import ResumeBuilderBanner from "@/components/resume-builder/banner";
import ResumeBuilderGenerate from "@/components/resume-builder/generate";
import ResumeSourceInput from "@/components/resume-builder/source-input";
import TemplateCard from "@/components/resume-builder/template";
import { useGetAllTemplateStore } from "@/stores/apis/resume/get-all-template.store";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { useTemplateSelectionStore } from "@/stores/apis/resume/template-selection.store";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildResumePayloadFromUser } from "./_utils/build-payload";
import {
  isResumeTemplateKey,
  TResumeTemplate,
} from "@/utils/types/resume/resume.type";
import { TemplateCardSkeleton } from "@/components/resume-builder/skeleton";
import { useTranslations } from "next-intl";
import {
  normalizeResumePayload,
  prepareResumeAvatar,
  removeLegacyResumeDraft,
  resumeDraftSchema,
  resumeSchema,
  saveResumeDraft,
} from "@/utils/functions/resume";
import { useGenerateAiResumeStore } from "@/stores/apis/resume/generate-ai-resume.store";
import { toast } from "sonner";
import { useAiQuotaStore } from "@/stores/apis/ai/get-ai-quota.store";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  RESUME_SOURCE_MAX_LENGTH,
  RESUME_TEMPLATE_LABEL_KEYS,
} from "@/utils/constants/resume.constant";
import { PageState } from "@/components/utils/feedback/page-state";

/* --------------------------------- Helper ---------------------------------- */
/** Numbered step header shared by each stage of the builder flow */
function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center border border-foreground bg-foreground text-xs font-medium text-background">
        {number}
      </div>
      <span className="pixel-label shrink-0 text-xs text-foreground">
        {title}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export default function ResumeBuilder() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const t = useTranslations("resumeBuilder");

  /* ----------------------------- API Integration ---------------------------- */
  // API state
  const {
    templateData,
    error: templatesError,
    loading: templatesLoading,
    queryAllTemplates,
  } = useGetAllTemplateStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const generateAiResume = useGenerateAiResumeStore(
    (state) => state.generateAiResume,
  );
  const generateAiResumeFromText = useGenerateAiResumeStore(
    (state) => state.generateAiResumeFromText,
  );
  const refreshAiQuota = useAiQuotaStore((state) => state.fetchQuota);
  const requestedTemplates = useRef<boolean>(false);

  /* -------------------------------- All States ------------------------------ */
  const { setPayload } = useResumeEditStore();
  const { setSelectedTemplate, selectedTemplate } = useTemplateSelectionStore();
  const [preparingResume, setPreparingResume] = useState<boolean>(false);
  const [sourceText, setSourceText] = useState<string>("");

  /* --------------------------------- Effects --------------------------------- */
  useEffect(() => {
    if (requestedTemplates.current || templateData !== null) return;
    requestedTemplates.current = true;
    void queryAllTemplates();
  }, [queryAllTemplates, templateData]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Template Selection ─────────────────────────────────────────
  const handleSelectTemplate = (templateKey: TResumeTemplate) =>
    setSelectedTemplate(templateKey);

  // ── Handle Generate Resume Payload ─────────────────────────────────────
  const handleGenerate = async () => {
    if (!currentUser || !currentUser.employee) return;
    if (!selectedTemplate) return;
    const pastedInfo = sourceText.trim();
    if (pastedInfo && pastedInfo.length < 20) {
      toast.error(t("pasteInfoTooShort"));
      return;
    }
    setPreparingResume(true);
    try {
      let mergedPayload: IBuildResume;

      if (pastedInfo) {
        const generatedPayload = await generateAiResumeFromText({
          sourceText: pastedInfo,
          template: selectedTemplate,
        });
        mergedPayload = normalizeResumePayload({
          ...generatedPayload,
          personalInfo: {
            ...generatedPayload.personalInfo,
            profilePicture: undefined,
          },
          template: selectedTemplate,
        });
      } else {
        const trustedPayload = buildResumePayloadFromUser(
          currentUser,
          selectedTemplate,
        );
        const aiInput: typeof trustedPayload = {
          ...trustedPayload,
          personalInfo: {
            ...trustedPayload.personalInfo,
            profilePicture: undefined,
          },
        };
        const [generatedPayload, profilePicture] = await Promise.all([
          generateAiResume(aiInput),
          prepareResumeAvatar(currentUser.employee.avatar),
        ]);
        mergedPayload = normalizeResumePayload({
          ...generatedPayload,
          personalInfo: {
            ...trustedPayload.personalInfo,
            profilePicture,
          },
          template: trustedPayload.template,
          sectionOrder: trustedPayload.sectionOrder,
        });
      }

      const parsed = (pastedInfo ? resumeDraftSchema : resumeSchema).safeParse(
        mergedPayload,
      );
      if (!parsed.success) throw new Error(t("aiGenerationInvalid"));
      const payload = parsed.data;

      removeLegacyResumeDraft();
      saveResumeDraft(currentUser.id, payload);
      setPayload(payload, currentUser.id);
      router.push("/resume-builder/edit");
    } catch (error) {
      toast.error(t("aiGenerationFailed"), {
        description:
          error instanceof Error ? error.message : t("aiGenerationTryAgain"),
      });
    } finally {
      setPreparingResume(false);
      void refreshAiQuota();
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="resume-builder-editorial w-full">
      {/* Banner Section */}
      <ResumeBuilderBanner />

      {/* Builder Workspace Section */}
      <div className="pixel-ruled w-full items-start border-x-0 border-b-0 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* Step 1: Template Selection Section */}
        <section className="flex min-w-0 flex-col gap-4 p-6 sm:p-8">
          <StepHeader number="1" title={t("chooseTemplate")} />

          {/* Template Grid Section */}
          <div className="resume-template-strip grid auto-cols-[82vw] grid-flow-col gap-4 overflow-x-auto pb-3 sm:auto-cols-auto sm:grid-flow-row sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-2 min-[1400px]:grid-cols-3">
            {templatesLoading || (templateData === null && !templatesError) ? (
              Array.from({ length: 6 }, (_, i) => (
                <TemplateCardSkeleton key={i} />
              ))
            ) : templatesError ? (
              <PageState
                variant="error"
                title={templatesError}
                description={t("templatesErrorDescription")}
                compact
                className="col-span-full"
                action={{
                  label: t("retry"),
                  onClick: () => void queryAllTemplates(),
                }}
              />
            ) : templateData && templateData.length > 0 ? (
              templateData.map((resume) => {
                if (!isResumeTemplateKey(resume.templateKey)) return null;
                const templateKey = resume.templateKey;
                const isSelected = selectedTemplate === templateKey;
                return (
                  <TemplateCard
                    key={resume.id}
                    templateKey={templateKey}
                    image={resume.image}
                    title={t(RESUME_TEMPLATE_LABEL_KEYS[templateKey])}
                    description={resume.description}
                    onUseTemplate={() => handleSelectTemplate(templateKey)}
                    selected={isSelected}
                  />
                );
              })
            ) : (
              <PageState
                variant="empty"
                title={t("noTemplatesTitle")}
                description={t("noTemplatesAvailable")}
                compact
                className="col-span-full"
                action={{
                  label: t("retry"),
                  onClick: () => void queryAllTemplates(),
                }}
              />
            )}
          </div>
        </section>

        {/* Builder Information Rail Section */}
        <aside className="flex min-w-0 flex-col gap-4">
          {/* Step 2: Information Source Section */}
          <StepHeader number="2" title={t("pasteInfoTitle")} />
          <ResumeSourceInput
            value={sourceText}
            onChange={setSourceText}
            disabled={preparingResume}
            maxLength={RESUME_SOURCE_MAX_LENGTH}
          />

          {/* Generate Action Section */}
          <ResumeBuilderGenerate
            disabled={!selectedTemplate || preparingResume}
            loading={preparingResume}
            onGenerateClick={() => void handleGenerate()}
            selectedTemplate={selectedTemplate}
            selectedTemplateLabel={
              selectedTemplate
                ? t(RESUME_TEMPLATE_LABEL_KEYS[selectedTemplate])
                : null
            }
          />
        </aside>
      </div>
    </div>
  );
}
