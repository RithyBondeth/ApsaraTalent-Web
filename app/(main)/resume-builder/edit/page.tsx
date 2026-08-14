"use client";

import ResumeEditorFormPanel from "@/components/resume-builder/editor/form-panel";
import ResumeEditorPreviewPanel from "@/components/resume-builder/editor/preview-panel";
import TemplateSelector from "@/components/resume-builder/editor/template-selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useGenerateResumeStore } from "@/stores/apis/resume/generate-resume.store";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { useIsMobile } from "@/hooks/utils/use-mobile";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  LoaderCircle,
  MoreHorizontal,
  PencilLine,
  PanelLeftOpen,
  PanelLeftClose,
  RotateCcw,
  SaveAll,
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
  matchesResumeOwnerName,
  normalizeResumePayload,
  prepareResumeAvatar,
  removeLegacyResumeDraft,
  resumeSchema,
  saveResumeDraft,
} from "@/utils/functions/resume";

export default function ResumeEditorPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("toast");
  const tRb = useTranslations("resumeBuilder");

  /* ----------------------------- API Integration ---------------------------- */
  const { generateResume } = useGenerateResumeStore();
  const currentUser = useGetCurrentUserStore((state) => state.user);
  const getCurrentUser = useGetCurrentUserStore(
    (state) => state.getCurrentUser,
  );

  /* -------------------------------- All States ------------------------------ */
  const { payload, ownerId, clearPayload, setPayload } = useResumeEditStore();
  const sectionOrder = useResumeCanvasEditorStore(
    (state) => state.sectionOrder,
  );
  // Primary Workspace Navigation
  const [formPanelOpen, setFormPanelOpen] = useState<boolean>(true);
  const [activeEditorTab, setActiveEditorTab] = useState<
    "content" | "layout" | "design"
  >("content");
  const [mobileWorkspace, setMobileWorkspace] = useState<"edit" | "preview">(
    "edit",
  );
  const [resetDialogOpen, setResetDialogOpen] = useState<boolean>(false);

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
  const [userResolved, setUserResolved] = useState<boolean>(false);
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

  /* ------------------------------ All Effects --------------------------------- */
  useEffect(() => {
    if (currentUser) {
      setUserResolved(true);
      return;
    }
    void getCurrentUser().finally(() => setUserResolved(true));
  }, [currentUser, getCurrentUser]);

  // Recover and validate a draft exactly once for the authenticated user.
  useEffect(() => {
    if (!userResolved || initializedRef.current) return;
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
    userResolved,
  ]);

  // Mobile always uses the dedicated Edit/Preview switch instead of a hidden panel.
  useEffect(() => {
    if (isMobile) setFormPanelOpen(true);
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
      setFormPanelOpen(true);
      setActiveEditorTab("content");
      setMobileWorkspace("edit");
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
    if (currentUser?.id) {
      const currentDraft = normalizeResumePayload(getValues() as IBuildResume);
      setPayload(currentDraft, currentUser.id);
      saveResumeDraft(currentUser.id, currentDraft);
    }
    router.push("/resume-builder");
  };

  // ── Handle Reset ────────────────────────────────────────
  const handleReset = () => {
    reset(payload ?? undefined);
    useResumeCanvasEditorStore
      .getState()
      .setSectionOrder(
        payload?.sectionOrder ?? [...RESUME_EDITOR_DEFAULT_SECTION_ORDER],
      );
    if (payload && currentUser?.id) saveResumeDraft(currentUser.id, payload);
    setResetDialogOpen(false);
    toast.success(tRb("resetSuccess"));
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
    <div className="resume-editor-shell animate-page-in flex h-[calc(100dvh-4rem)] flex-col overflow-hidden text-foreground">
      {/* Primary Action Bar Section */}
      <div className="resume-editor-controls flex flex-col gap-2 border-b border-t-[5px] border-border border-t-foreground bg-card px-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:px-5">
        {/* Editor Identity and Template Section */}
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="h-8 gap-1.5 rounded-none text-xs"
          >
            <ArrowLeft size={14} />
            {tRb("back")}
          </Button>

          {!formPanelOpen && !isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFormPanelOpen(true)}
              className="hidden h-8 gap-1.5 rounded-none text-xs md:flex"
              title={tRb("showFields")}
            >
              <PanelLeftOpen size={14} />
              {tRb("showFields")}
            </Button>
          )}

          {/* Resume Editor Label Section */}
          <div className="hidden items-center gap-2 border-l-2 border-foreground pl-3 sm:flex">
            <FileText size={16} className="shrink-0 text-foreground" />
            <div className="flex flex-col">
              <TypographyLead className="text-[13px] font-bold leading-none">
                {tRb("resumeEditor")}
              </TypographyLead>
              <TypographySmall className="mt-0.5 text-[10px] font-medium uppercase tracking-tight text-muted-foreground">
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

        {/* Save State and Primary Actions Section */}
        <div className="flex w-full items-center justify-end gap-2 md:w-auto">
          <div className="mr-auto hidden items-center gap-1.5 text-[10px] font-medium text-muted-foreground sm:flex md:mr-1">
            {previewUpdating ? (
              <LoaderCircle className="size-3 animate-spin" />
            ) : (
              <SaveAll className="size-3.5" />
            )}
            {previewUpdating ? tRb("savingChanges") : tRb("savedAutomatically")}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-none"
                title={tRb("moreActions")}
              >
                <MoreHorizontal size={15} />
                <span className="sr-only">{tRb("moreActions")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-none border-border p-1"
            >
              <DropdownMenuItem
                onSelect={() => setResetDialogOpen(true)}
                className="rounded-none text-xs"
              >
                <RotateCcw size={14} />
                {tRb("reset")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="sm"
            className="h-8 flex-1 shrink-0 justify-center gap-2 rounded-none px-4 text-xs sm:w-auto sm:flex-none"
          >
            <Download size={15} />
            {tRb("downloadPdf")}
          </Button>
        </div>
      </div>

      {/* Mobile Workspace Switcher Section */}
      <div className="grid shrink-0 grid-cols-2 border-b border-border bg-card p-2 md:hidden">
        <button
          type="button"
          aria-pressed={mobileWorkspace === "edit"}
          onClick={() => setMobileWorkspace("edit")}
          className={`flex h-9 items-center justify-center gap-2 border text-xs font-bold transition-colors ${
            mobileWorkspace === "edit"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-muted-foreground"
          }`}
        >
          <PencilLine size={14} />
          {tRb("mobileEdit")}
        </button>
        <button
          type="button"
          aria-pressed={mobileWorkspace === "preview"}
          onClick={() => setMobileWorkspace("preview")}
          className={`flex h-9 items-center justify-center gap-2 border border-l-0 text-xs font-bold transition-colors ${
            mobileWorkspace === "preview"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-muted-foreground"
          }`}
        >
          <Eye size={14} />
          {tRb("preview")}
        </button>
      </div>

      {/* Focused Editor Workspace Section */}
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/20 md:flex-row">
        {/* Editor Form Section */}
        {formPanelOpen && (!isMobile || mobileWorkspace === "edit") && (
          <div className="resume-editor-controls flex w-full flex-1 flex-col overflow-hidden border-b border-border bg-card shadow-[5px_0_0_hsl(var(--foreground)/0.035)] md:w-[380px] md:flex-none md:border-b-0 md:border-r lg:w-[420px] xl:w-[440px]">
            {/* Form Panel Section  */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-3 py-3 sm:px-4">
              <div className="min-w-0">
                <TypographyP className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {tRb("editorPanelTitle")}
                </TypographyP>
                <TypographySmall className="mt-0.5 block truncate text-[10px] text-muted-foreground">
                  {tRb("editDetails")}
                </TypographySmall>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <AiResumeOptimizerDrawer
                  getCurrentValues={() => getValues() as IBuildResume}
                  onApplySummary={handleApplySummary}
                  onApplySkills={handleApplySkills}
                  onApplyExperience={handleApplyExperience}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormPanelOpen(false)}
                  className="hidden size-8 rounded-none md:inline-flex"
                  title={tRb("hideFields")}
                >
                  <PanelLeftClose size={14} />
                  <span className="sr-only">{tRb("hideFields")}</span>
                </Button>
              </div>
            </div>

            {/* Form Editor Section */}
            <div className="flex-1 overflow-hidden px-3 pb-3 pt-3 sm:px-4 sm:pb-4">
              <ResumeEditorFormPanel
                register={register}
                control={control}
                setValue={setValue}
                getValues={getValues}
                activeTab={activeEditorTab}
                onTabChange={setActiveEditorTab}
              />
            </div>
          </div>
        )}

        {/* Editable Canvas Section */}
        {(!isMobile || mobileWorkspace === "preview") && (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ResumeEditorPreviewPanel
              data={previewData}
              setValue={setValue}
              getValues={getValues}
              updating={previewUpdating}
            />
          </div>
        )}
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

      {/* Reset Confirmation Dialog Section */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-none border border-foreground/20 bg-card p-0 shadow-[9px_9px_0_hsl(var(--foreground)/0.12),0_24px_70px_hsl(var(--foreground)/0.18)] sm:rounded-none">
          <header className="relative overflow-hidden border-b border-foreground bg-foreground p-5 text-background">
            <div className="profile-detail-hero-grid" aria-hidden />
            <div className="relative z-[2] flex items-center gap-3 pr-8">
              <span className="flex size-11 shrink-0 items-center justify-center border border-background/25 bg-background/10">
                <RotateCcw size={18} />
              </span>
              <DialogTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                {tRb("resetDialogTitle")}
              </DialogTitle>
            </div>
          </header>

          <div className="p-5">
            <DialogDescription className="border border-border bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
              {tRb("resetConfirm")}
            </DialogDescription>
            <DialogFooter className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-2 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetDialogOpen(false)}
                className="h-10 w-full rounded-none"
              >
                {tRb("cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReset}
                className="h-10 w-full rounded-none"
              >
                <RotateCcw size={14} />
                {tRb("reset")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
