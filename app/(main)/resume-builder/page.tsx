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
import { TypographyP } from "@/components/utils/typography/typography-p";
import {
  normalizeResumePayload,
  removeLegacyResumeDraft,
  resumeDraftSchema,
  resumeSchema,
  saveResumeDraft,
} from "@/utils/functions/resume/resume-draft";
import { Button } from "@/components/ui/button";
import { prepareResumeAvatar } from "@/utils/functions/resume/prepare-resume-avatar";
import { useGenerateAiResumeStore } from "@/stores/apis/resume/generate-ai-resume.store";
import { toast } from "sonner";
import { useAiQuotaStore } from "@/stores/apis/ai/get-ai-quota.store";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  RESUME_SOURCE_MAX_LENGTH,
  RESUME_TEMPLATE_LABEL_KEYS,
} from "@/utils/constants/resume.constant";

/* --------------------------------- Helper ---------------------------------- */
/** Numbered step header shared by each stage of the builder flow */
function StepHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex h-7 min-w-9 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand-soft px-2 text-[11px] font-bold tabular-nums text-brand-soft-foreground">
        {number.padStart(2, "0")}
      </div>
      <span className="shrink-0 text-sm font-semibold text-foreground/90">
        {title}
      </span>
      <div className="h-px flex-1 bg-border/70" />
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
  const refreshAiQuota = useAiQuotaStore((state) => state.refreshAfterUse);
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
    <div className="flex w-full flex-col items-start gap-7 px-2.5 pb-5 sm:px-5 lg:px-8 animate-page-in">
      {/* Banner Section */}
      <ResumeBuilderBanner />

      {/* Step 1: Template Selection Section */}
      <section className="flex w-full flex-col gap-4">
        <StepHeader number="1" title={t("chooseTemplate")} />
        <div className="stagger-list grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templatesLoading || (templateData === null && !templatesError) ? (
            Array.from({ length: 6 }, (_, i) => (
              <TemplateCardSkeleton key={i} />
            ))
          ) : templatesError ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-3">
              <TypographyP className="text-sm text-destructive text-center">
                {templatesError}
              </TypographyP>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void queryAllTemplates()}
              >
                {t("retry")}
              </Button>
            </div>
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
            <div className="col-span-full flex flex-col items-center justify-center py-12 gap-2">
              <TypographyP className="text-sm text-muted-foreground">
                {t("noTemplatesAvailable")}
              </TypographyP>
            </div>
          )}
        </div>
      </section>

      {/* Step 2: Information Source Section */}
      <section className="flex w-full flex-col gap-4">
        <StepHeader number="2" title={t("pasteInfoTitle")} />
        <ResumeSourceInput
          value={sourceText}
          onChange={setSourceText}
          disabled={preparingResume}
          maxLength={RESUME_SOURCE_MAX_LENGTH}
        />
      </section>

      {/* Sticky Generate Bar Section */}
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
    </div>
  );
}
