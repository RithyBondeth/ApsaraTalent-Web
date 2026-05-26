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
import { useForm, useWatch } from "react-hook-form";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import { LIVE_RESUME_PREVIEW_DEBOUNCE_MS } from "@/utils/constants/resume.constant";
import { TypographyLead } from "@/components/utils/typography/typography-lead";
import { TypographySmall } from "@/components/utils/typography/typography-small";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { TResumeTemplate } from "@/utils/types/resume/resume.type";
import { AiResumeOptimizerDrawer } from "@/components/resume-builder/ai-optimizer-drawer";

const RESUME_LOCAL_STORAGE_KEY = "apsara-talent-resume-draft";

export default function ResumeEditorPage() {
  /* ---------------------------------- Utils --------------------------------- */
  const router = useRouter();
  const isMobile = useIsMobile();
  const t = useTranslations("toast");
  const tRb = useTranslations("resumeBuilder");

  /* ----------------------------- API Integration ---------------------------- */
  const { generateResume } = useGenerateResumeStore();

  /* -------------------------------- All States ------------------------------ */
  const { payload, clearPayload, setPayload } = useResumeEditStore();

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

  // Download progress states
  const [downloading, setDownloading] = useState<boolean>(false);
  const [dlProgress, setDlProgress] = useState<number>(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ------------------------------ React Hook Form --------------------------- */
  const { register, control, getValues, setValue, reset } =
    useForm<IBuildResume>({
      defaultValues: payload ?? undefined,
    });
  const watchedValues = useWatch({ control }) as IBuildResume;

  /* --------------------------------- Effects --------------------------------- */
  // Recover from localStorage on mount if store is empty
  useEffect(() => {
    if (!payload) {
      const saved = localStorage.getItem(RESUME_LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as IBuildResume;
          setPayload(parsed);
          reset(parsed);
          setPreviewData(parsed);
        } catch (e) {
          console.error("Failed to parse saved resume draft", e);
        }
      } else {
        router.replace("/resume-builder");
      }
    }
  }, [payload, router, setPayload, reset]);

  // Sync form if the store payload changes after mount
  useEffect(() => {
    if (payload) reset(payload);
  }, [payload, reset]);

  // Update left panel (form) collapsed state based on mobile view
  useEffect(() => {
    setFormPanelOpen(!isMobile);
  }, [isMobile]);

  // Live preview with 600 ms debounce + local storage persistence
  useEffect(() => {
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
      // Persist to local storage
      localStorage.setItem(
        RESUME_LOCAL_STORAGE_KEY,
        JSON.stringify(watchedValues),
      );
    }, LIVE_RESUME_PREVIEW_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watchedValues]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Download Progress ─────────────────────────────────────────
  const startProgress = (cap = 95) => {
    setDlProgress(0);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      const increment = Math.max(0.4, (cap - current) * 0.035);
      current = Math.min(cap, current + increment);
      setDlProgress(current);
      if (current >= cap) clearInterval(progressTimerRef.current!);
    }, 300);
  };

  const stopProgress = (finalValue = 100) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setDlProgress(finalValue);
  };

  // ── Handle Download ─────────────────────────────────────────
  const handleDownload = async () => {
    const raw = getValues() as IBuildResume;

    // Strip careerScopes — hidden section, not shown in resume.
    const currentPayload: IBuildResume = { ...raw, careerScopes: undefined };
    setDownloading(true);
    startProgress(95);
    try {
      const result = await generateResume(currentPayload);
      if (!result?.data || typeof result.data !== "string") {
        throw new Error("Resume service returned invalid data");
      }
      stopProgress(100);
      await new Promise((r) => setTimeout(r, 500));

      const byteCharacters = atob(result.data);
      const byteNumbers = Array.from(
        { length: byteCharacters.length },
        (_, i) => byteCharacters.charCodeAt(i),
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.mimeType });
      const link = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = result.filename || "resume.pdf";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);

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
    localStorage.removeItem(RESUME_LOCAL_STORAGE_KEY);
    router.push("/resume-builder");
  };

  // ── Handle Reset ────────────────────────────────────────
  const handleReset = () => {
    if (confirm(tRb("resetConfirm"))) {
      reset(payload ?? undefined);
      localStorage.removeItem(RESUME_LOCAL_STORAGE_KEY);
      toast.success(tRb("resetSuccess"));
    }
  };

  // ── AI Optimizer Callbacks ───────────────────────────────
  const handleApplySummary = useCallback(
    (summary: string) => {
      setValue("summary", summary, { shouldDirty: true });
      toast.success("Summary updated");
    },
    [setValue],
  );

  const handleApplySkills = useCallback(
    (newSkills: string[]) => {
      const current = getValues("skills") ?? [];
      const merged = Array.from(new Set([...current, ...newSkills]));
      setValue("skills", merged, { shouldDirty: true });
      toast.success(`Added ${newSkills.length} suggested skills`);
    },
    [setValue, getValues],
  );

  const handleApplyExperience = useCallback(
    (index: number, description: string, achievements: string[]) => {
      setValue(`experience.${index}.description`, description, {
        shouldDirty: true,
      });
      setValue(`experience.${index}.achievements`, achievements, {
        shouldDirty: true,
      });
      toast.success(`Experience #${index + 1} updated`);
    },
    [setValue],
  );

  /* ------------------------------- Null State -------------------------------- */
  // During SSR or if no data is available yet, return null.
  // Redirection and recovery are handled in useEffect.
  if (
    typeof window === "undefined" ||
    (!payload && !localStorage.getItem(RESUME_LOCAL_STORAGE_KEY))
  ) {
    return null;
  }

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden animate-page-in text-foreground">
      {/* Top Action Bar Section */}
      <div className="flex flex-col gap-2 border-b bg-background px-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        {/* Left Section: Back + Toggle Form + Title */}
        <div className="flex w-full flex-wrap items-start gap-2 sm:w-auto sm:items-center sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-1.5 h-8 text-xs"
          >
            <ArrowLeft size={14} />
            {tRb("back")}
          </Button>

          {/* Toggle The Form Panel Section */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormPanelOpen((v) => !v)}
            className="gap-1.5 h-8 text-xs"
            title={formPanelOpen ? tRb("hideFields") : tRb("showFields")}
          >
            {formPanelOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
            <span className="hidden sm:inline">
              {formPanelOpen ? tRb("hideFields") : tRb("showFields")}
            </span>
            <span className="sm:hidden">
              {formPanelOpen ? tRb("hide") : tRb("fields")}
            </span>
          </Button>

          {/* Vertical Separator Section */}
          <div className="hidden h-6 w-px bg-border sm:block" />

          {/* Resume Title Section */}
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary shrink-0" />
            <div className="flex flex-col">
              <TypographyLead className="text-[13px] font-bold leading-none">
                {tRb("resumeEditor")}
              </TypographyLead>
              <TypographySmall className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tight font-medium">
                {tRb("templateLabel")}
              </TypographySmall>
            </div>
          </div>

          {/* Template Selector Section */}
          <TemplateSelector
            value={watchedValues.template}
            onChange={(next) =>
              setValue("template", next, { shouldDirty: true })
            }
          />
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
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
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            title={tRb("reset")}
          >
            <RotateCcw size={14} />
            <span className="hidden lg:inline">{tRb("reset")}</span>
          </Button>
          <Button
            onClick={handleDownload}
            disabled={downloading}
            size="sm"
            className="h-8 text-xs flex-1 shrink-0 justify-center gap-2 sm:w-auto sm:flex-none px-4"
          >
            <Download size={15} />
            {tRb("downloadPdf")}
          </Button>
        </div>
      </div>

      {/* Split Layout Section */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row bg-muted/20">
        {/* Left Section: Form Panel (Collapsible) */}
        {formPanelOpen && (
          <div className="w-full shrink-0 flex flex-col border-b bg-background overflow-hidden max-h-[60vh] lg:max-h-none lg:w-[420px] lg:border-b-0 lg:border-r border-border/60 shadow-sm">
            <div className="shrink-0 px-3 pt-3 pb-1 sm:px-4 sm:pt-4">
              <TypographyP className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider">
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
