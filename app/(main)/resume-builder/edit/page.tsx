"use client";

import ResumeEditorFormPanel from "@/components/resume-builder/editor/form-panel";
import ResumeEditorPreviewPanel from "@/components/resume-builder/editor/preview-panel";
import { Button } from "@/components/ui/button";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { toast } from "sonner";
import { generateResumeAPI } from "../_apis/generate-resume.api";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowLeft,
  Download,
  FileText,
  PanelLeftOpen,
  PanelLeftClose,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import {
  DOWNLOAD_RESUME_STEPS,
  LIVE_RESUME_PREVIEW_DEBOUNCE_MS,
} from "@/utils/constants/app.constant";

export default function ResumeEditorPage() {
  /* ---------------------------------- Utils ---------------------------------- */
  const router = useRouter();
  const isMobile = useIsMobile();

  /* ----------------------------- API Integration ---------------------------- */
  const { payload, clearPayload } = useResumeEditStore();

  /* -------------------------------- All States ------------------------------- */
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

  /* ------------------------------- Profile Form ------------------------------- */
  const { register, control, getValues, setValue, reset } =
    useForm<IBuildResume>({
      defaultValues: payload ?? undefined,
    });
  const watchedValues = useWatch({ control }) as IBuildResume;

  /* --------------------------------- Effects ---------------------------------- */
  // Redirect if no payload in store
  useEffect(() => {
    if (!payload) router.replace("/resume-builder");
  }, [payload, router]);

  // Sync form if the store payload changes after mount
  useEffect(() => {
    if (payload) reset(payload);
  }, [payload, reset]);

  // Update left panel (form) collapsed state based on mobile view
  useEffect(() => {
    setFormPanelOpen(!isMobile);
  }, [isMobile]);

  // Live preview with 600 ms debounce
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
    }, LIVE_RESUME_PREVIEW_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watchedValues]);

  /* -------------------------------- Methods --------------------------------- */
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
      const result = await generateResumeAPI(currentPayload);
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
      link.click();
      window.URL.revokeObjectURL(objectUrl);

      toast.success("Resume downloaded!", {
        description: "Your resume has been saved to your downloads folder.",
      });

      // Clear store and go back to template selection
      clearPayload();
      router.push("/resume-builder");
    } catch (error) {
      console.error("Failed to generate resume:", error);
      stopProgress(0);
      const description =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error("Download failed", {
        description,
      });
    } finally {
      setDownloading(false);
    }
  };

  // ── Handle Back ─────────────────────────────────────────
  const handleBack = () => {
    clearPayload();
    router.push("/resume-builder");
  };

  /* -------------------------------- Render UI -------------------------------- */
  if (!payload) return null;

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] overflow-hidden">
      {/* ── Top Action Bar ───────────────────────────────────────── */}
      <div className="flex flex-col gap-2 border-b bg-background px-2.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        {/* Left: Back + Toggle Form + Title */}
        <div className="flex w-full flex-wrap items-start gap-2 sm:w-auto sm:items-center sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-1.5"
          >
            <ArrowLeft size={14} />
            Back
          </Button>

          {/* Toggle The Form Panel */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFormPanelOpen((v) => !v)}
            className="gap-1.5"
            title={formPanelOpen ? "Hide form panel" : "Show form panel"}
          >
            {formPanelOpen ? (
              <PanelLeftClose size={14} />
            ) : (
              <PanelLeftOpen size={14} />
            )}
            <span className="hidden sm:inline">
              {formPanelOpen ? "Hide Fields" : "Show Fields"}
            </span>
            <span className="sm:hidden">
              {formPanelOpen ? "Hide" : "Fields"}
            </span>
          </Button>

          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold leading-none">
                Resume Editor
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                Template:{" "}
                <span className="text-foreground font-medium">
                  {payload.template}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Download Button */}
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full shrink-0 justify-center gap-2 sm:w-auto"
        >
          <Download size={15} />
          Download PDF
        </Button>
      </div>

      {/* ── Split Layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Left — Form Panel (Collapsible) */}
        {formPanelOpen && (
          <div className="w-full shrink-0 flex flex-col border-b bg-background overflow-hidden max-h-[56vh] lg:max-h-none lg:w-[420px] lg:border-b-0 lg:border-r">
            <div className="shrink-0 px-3 pt-3 pb-2 sm:px-4 sm:pt-4">
              <p className="text-xs text-muted-foreground">
                Edit your resume details below. The canvas updates
                automatically.
              </p>
            </div>
            <div className="flex-1 overflow-hidden px-3 pb-3 sm:px-4 sm:pb-4">
              <ResumeEditorFormPanel
                register={register}
                control={control}
                setValue={setValue}
              />
            </div>
          </div>
        )}

        {/* Right — editable canvas (full width when form is hidden) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResumeEditorPreviewPanel
            data={previewData}
            setValue={setValue}
            getValues={getValues}
            updating={previewUpdating}
          />
        </div>
      </div>

      {/* Download Loading Dialog */}
      <LoadingDialog
        loading={downloading}
        title="Generating your PDF..."
        steps={DOWNLOAD_RESUME_STEPS}
        progress={dlProgress}
      />
    </div>
  );
}
