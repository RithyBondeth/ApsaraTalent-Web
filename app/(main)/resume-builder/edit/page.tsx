"use client";

import ResumeEditorFormPanel from "@/components/resume-builder/editor/form-panel";
import ResumeEditorPreviewPanel from "@/components/resume-builder/editor/preview-panel";
import TemplateSelector from "@/components/resume-builder/editor/template-selector";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useGenerateResumeStore } from "@/stores/apis/resume/generate-resume.store";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { useIsMobile } from "@/hooks/utils/use-mobile";
import {
  ArrowLeft,
  Download,
  FileText,
  PanelLeftOpen,
  PanelLeftClose,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDownloadProgress } from "@/hooks/utils/use-download-progress";
import { downloadBase64File } from "@/utils/functions/file";
import { useForm, useWatch } from "react-hook-form";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  LIVE_RESUME_PREVIEW_DEBOUNCE_MS,
  RESUME_EDITOR_DEFAULT_SECTION_ORDER,
} from "@/utils/constants/resume.constant";
import { RESUME_DOWNLOAD_SETTLE_MS } from "@/utils/constants/config.constant";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { AiResumeOptimizerDrawer } from "@/components/resume-builder/ai-optimizer-drawer";
import { useGetCurrentUserStore } from "@/stores/apis/users/get-current-user.store";
import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { ResumeEditorLoadingSkeleton } from "@/components/resume-builder/skeleton";
import {
  loadResumeDraft,
  normalizeResumePayload,
  removeLegacyResumeDraft,
  removeResumeDraft,
  resumeSchema,
  saveResumeDraft,
} from "@/utils/functions/resume/resume-draft";
import {
  matchesResumeOwnerName,
  prepareResumeAvatar,
} from "@/utils/functions/resume/prepare-resume-avatar";

export default function ResumeEditorPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("toast");
  const tRb = useTranslations("resumeBuilder");

  /* ----------------------------- API Integration ---------------------------- */
  const { generateResume } = useGenerateResumeStore();

  /* -------------------------------- All States ------------------------------ */
  const { payload, ownerId, clearPayload, setPayload } = useResumeEditStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const sectionOrder = useResumeCanvasEditorStore(
    (state) => state.sectionOrder,
  );

  // Left panel (form) collapsed state
  const [formPanelOpen, setFormPanelOpen] = useState<boolean>(false);

  // Live preview states
  const [previewData, setPreviewData] = useState<IBuildResume>(
    payload ?? ({} as IBuildResume),
  );
  // Only show "updating" badge after the user has made their first change
  const [previewUpdating, setPreviewUpdating] = useState<boolean>(false);
  const hasInteracted = useRef<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedRef = useRef<boolean>(false);
  const [draftReady, setDraftReady] = useState<boolean>(false);
  const [userStoreHydrated, setUserStoreHydrated] = useState<boolean>(false);

  // Download progress states
  const [downloading, setDownloading] = useState<boolean>(false);
  const {
    progress: dlProgress,
    start: startProgress,
    stop: stopProgress,
  } = useDownloadProgress();

  /* ------------------------------ React Hook Form --------------------------- */
  const { register, control, getValues, setValue, reset } =
    useForm<IBuildResume>({
      defaultValues: payload ?? undefined,
    });
  const watchedValues = useWatch({ control }) as IBuildResume;

  /* --------------------------------- Effects --------------------------------- */
  // Wait for the persisted current-user store before choosing a user-scoped draft.
  useEffect(() => {
    const persistApi = useGetCurrentUserStore.persist;
    if (!persistApi) {
      setUserStoreHydrated(true);
      return;
    }
    if (persistApi.hasHydrated()) {
      setUserStoreHydrated(true);
    }
    return persistApi.onFinishHydration(() => setUserStoreHydrated(true));
  }, []);

  // Recover and validate a draft exactly once for the authenticated user.
  useEffect(() => {
    if (!userStoreHydrated || initializedRef.current) return;
    if (!currentUser?.id || !currentUser.employee) {
      router.replace("/resume-builder");
      return;
    }

    initializedRef.current = true;
    const employee = currentUser.employee;
    const employeeAvatar = employee.avatar;
    removeLegacyResumeDraft();
    const initial =
      payload && ownerId === currentUser.id
        ? normalizeResumePayload(payload)
        : loadResumeDraft(currentUser.id);

    if (!initial) {
      clearPayload();
      router.replace("/resume-builder");
      return;
    }

    let cancelled = false;
    void (async () => {
      let hydratedInitial = initial;
      const employeeFullName = [employee.firstname, employee.lastname]
        .filter(Boolean)
        .join(" ");
      const resumeBelongsToCurrentUser = matchesResumeOwnerName(
        initial.personalInfo.fullName,
        [
          employeeFullName,
          employee.username ?? undefined,
          currentUser.email?.split("@")[0] ?? undefined,
        ],
      );
      if (
        !initial.personalInfo.profilePicture &&
        employeeAvatar &&
        resumeBelongsToCurrentUser
      ) {
        const profilePicture = await prepareResumeAvatar(employeeAvatar);
        if (profilePicture) {
          hydratedInitial = {
            ...initial,
            personalInfo: { ...initial.personalInfo, profilePicture },
          };
        }
      }
      if (cancelled) return;

      const order = hydratedInitial.sectionOrder ?? [
        ...RESUME_EDITOR_DEFAULT_SECTION_ORDER,
      ];
      useResumeCanvasEditorStore.getState().setSectionOrder(order);
      setPayload(hydratedInitial, currentUser.id);
      reset(hydratedInitial);
      setPreviewData(hydratedInitial);
      saveResumeDraft(currentUser.id, hydratedInitial);
      hasInteracted.current = false;
      setDraftReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [
    clearPayload,
    currentUser,
    ownerId,
    payload,
    reset,
    router,
    setPayload,
    userStoreHydrated,
  ]);

  // Update left panel (form) collapsed state based on mobile view
  useEffect(() => {
    setFormPanelOpen(!isMobile);
  }, [isMobile]);

  // Section visibility/order is part of the document contract and PDF payload.
  useEffect(() => {
    if (!draftReady) return;
    setValue("sectionOrder", [...sectionOrder], { shouldDirty: true });
  }, [draftReady, sectionOrder, setValue]);

  // Live preview with 600 ms debounce + user-scoped session draft persistence
  useEffect(() => {
    if (!draftReady || !currentUser?.id) return;
    // Skip the initial render — form values haven't changed yet
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      return;
    }
    setPreviewUpdating(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewData({ ...watchedValues } as IBuildResume);
      setPreviewUpdating(false);
      saveResumeDraft(
        currentUser.id,
        normalizeResumePayload(watchedValues as IBuildResume),
      );
    }, LIVE_RESUME_PREVIEW_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [currentUser?.id, draftReady, watchedValues]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Handle Download ─────────────────────────────────────────
  const handleDownload = async () => {
    const raw = normalizeResumePayload(getValues() as IBuildResume);
    const validation = resumeSchema.safeParse(raw);
    if (!validation.success) {
      const issue = validation.error.issues[0];
      toast.error(tRb("validationFailed"), {
        description: issue
          ? tRb("validationDescription")
          : t("somethingWentWrong"),
      });
      return;
    }
    const currentPayload = validation.data as IBuildResume;
    setDownloading(true);
    startProgress(95);
    try {
      const result = await generateResume(currentPayload);
      if (!result?.data || typeof result.data !== "string") {
        throw new Error("Resume service returned invalid data");
      }
      stopProgress(100);
      await new Promise((r) => setTimeout(r, RESUME_DOWNLOAD_SETTLE_MS));

      downloadBase64File(
        result.data,
        result.mimeType,
        result.filename || "resume.pdf",
      );

      toast.success(t("resumeDownloaded"), {
        description: t("resumeSavedToDownloads"),
      });
    } catch (error) {
      console.error("Failed to generate resume:", error);
      stopProgress(0);
      const description =
        error instanceof Error && error.message
          ? error.message
          : t("somethingWentWrong");
      toast.error(t("downloadFailed"), {
        description,
      });
    } finally {
      setDownloading(false);
    }
  };

  // ── Handle Back ─────────────────────────────────────────
  const handleBack = () => {
    clearPayload();
    if (currentUser?.id) removeResumeDraft(currentUser.id);
    removeLegacyResumeDraft();
    router.push("/resume-builder");
  };

  // ── Handle Reset ────────────────────────────────────────
  const handleReset = () => {
    if (confirm(tRb("resetConfirm"))) {
      reset(payload ?? undefined);
      useResumeCanvasEditorStore
        .getState()
        .setSectionOrder(
          payload?.sectionOrder ?? [...RESUME_EDITOR_DEFAULT_SECTION_ORDER],
        );
      if (payload && currentUser?.id) saveResumeDraft(currentUser.id, payload);
      toast.success(tRb("resetSuccess"));
    }
  };

  // ── AI Optimizer Callbacks ───────────────────────────────
  const handleApplySummary = useCallback(
    (summary: string) => {
      setValue("summary", summary, { shouldDirty: true });
      toast.success(tRb("summaryUpdated"));
    },
    [setValue, tRb],
  );

  const handleApplySkills = useCallback(
    (newSkills: string[]) => {
      const current = getValues("skills") ?? [];
      const merged = Array.from(new Set([...current, ...newSkills]));
      setValue("skills", merged, { shouldDirty: true });
      toast.success(tRb("suggestedSkillsAdded", { count: newSkills.length }));
    },
    [setValue, getValues, tRb],
  );

  const handleApplyExperience = useCallback(
    (index: number, description: string, achievements: string[]) => {
      setValue(`experience.${index}.description`, description, {
        shouldDirty: true,
      });
      setValue(`experience.${index}.achievements`, achievements, {
        shouldDirty: true,
      });
      toast.success(tRb("experienceUpdated", { number: index + 1 }));
    },
    [setValue, tRb],
  );

  /* ------------------------------- Null State -------------------------------- */
  if (!draftReady || !currentUser?.id) {
    return <ResumeEditorLoadingSkeleton />;
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-background text-foreground animate-page-in">
      {/* Top Action Bar Section */}
      <div className="z-20 flex flex-col gap-2.5 border-b border-border/80 bg-card/95 px-3 py-3 backdrop-blur-xl sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
        {/* Left Section: Back + Title + Template */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-9 shrink-0 gap-1.5 rounded-xl px-3 text-xs"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">{tRb("back")}</span>
          </Button>

          {/* Vertical Separator Section */}
          <div className="h-7 w-px shrink-0 bg-border" />

          {/* Resume Title Section */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand-soft">
              <FileText size={16} className="shrink-0 text-brand" />
            </div>
            <div className="hidden min-w-0 flex-col sm:flex">
              <TypographyLead className="truncate text-[13px] font-bold leading-none">
                {tRb("resumeEditor")}
              </TypographyLead>
              <TypographySmall className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {tRb("templateLabel")}
              </TypographySmall>
            </div>
          </div>

          {/* Template Selector Section */}
          <TemplateSelector
            value={watchedValues.template}
            onChange={(next) => {
              setValue("template", next, { shouldDirty: true });
              setValue("design", undefined, { shouldDirty: true });
            }}
          />
        </div>

        {/* Right Section: Editing + Export Actions */}
        <div className="scrollbar-none flex w-full items-center gap-2 overflow-x-auto lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormPanelOpen((v) => !v)}
            className="h-9 shrink-0 gap-1.5 rounded-xl px-3 text-xs"
            title={formPanelOpen ? tRb("hideFields") : tRb("showFields")}
          >
            {formPanelOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
            <span>{formPanelOpen ? tRb("hideFields") : tRb("showFields")}</span>
          </Button>
          <AiResumeOptimizerDrawer
            getCurrentValues={() => getValues() as IBuildResume}
            onApplySummary={handleApplySummary}
            onApplySkills={handleApplySkills}
            onApplyExperience={handleApplyExperience}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-9 shrink-0 gap-1.5 rounded-xl px-3 text-xs text-muted-foreground hover:text-foreground"
            title={tRb("reset")}
          >
            <RotateCcw size={14} />
            <span className="hidden lg:inline">{tRb("reset")}</span>
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="sm"
            className="h-9 flex-1 shrink-0 justify-center gap-2 rounded-xl px-4 text-xs shadow-sm sm:w-auto sm:flex-none"
          >
            <Download size={15} />
            {tRb("downloadPdf")}
          </Button>
        </div>
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 flex-col overflow-hidden bg-[hsl(var(--illustration-surface))] lg:flex-row">
        {/* Left Section: Form Panel (Collapsible) */}
        {formPanelOpen && (
          <div className="resume-editor-form-panel flex max-h-[62vh] w-full shrink-0 flex-col overflow-hidden border-b border-border/70 bg-card lg:max-h-none lg:w-[400px] lg:border-b-0 lg:border-r">
            <div className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-3 sm:px-4 sm:pt-4">
              <span
                className="size-2 rounded-full bg-brand"
                aria-hidden="true"
              />
              <TypographyP className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
                {tRb("editDetails")}
              </TypographyP>
            </div>
            <div className="flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
              <ResumeEditorFormPanel
                register={register}
                control={control}
                setValue={setValue}
                getValues={getValues}
              />
            </div>
          </div>
        )}

        {/* Right Section: Editable Canvas (full width when form is hidden) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResumeEditorPreviewPanel
            data={previewData}
            setValue={setValue}
            getValues={getValues}
            updating={previewUpdating}
          />
        </div>
      </div>

      {/* Download Loading Dialog Section */}
      <LoadingDialog
        loading={downloading}
        title={tRb("generatingPdf")}
        steps={[
          { label: tRb("downloadStep1"), completeAt: 20 },
          { label: tRb("downloadStep2"), completeAt: 40 },
          { label: tRb("downloadStep3"), completeAt: 60 },
          { label: tRb("downloadStep4"), completeAt: 78 },
          { label: tRb("downloadStep5"), completeAt: 92 },
          { label: tRb("downloadStep6"), completeAt: 99 },
        ]}
        progress={dlProgress}
      />
    </div>
  );
}
