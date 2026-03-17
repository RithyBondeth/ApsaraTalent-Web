"use client";

import ResumeEditorFormPanel from "@/components/resume-builder/editor/form-panel";
import ResumeEditorPreviewPanel from "@/components/resume-builder/editor/preview-panel";
import { Button } from "@/components/ui/button";
import LoadingDialog, {
  LoadingStep,
} from "@/components/utils/dialogs/loading-dialog";
import { toast } from "sonner";
import { generateResumeAPI, BuildResume } from "../_apis/generate-resume.api";
import { useResumeEditStore } from "@/stores/apis/resume/resume-edit.store";
import { ArrowLeft, Download, FileText, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

/* ─── Download progress steps ────────────────────────────────── */
const DOWNLOAD_STEPS: LoadingStep[] = [
  { label: "Preparing your resume data", completeAt: 20 },
  { label: "Sending to AI engine", completeAt: 40 },
  { label: "Generating HTML layout", completeAt: 60 },
  { label: "Applying template styling", completeAt: 78 },
  { label: "Rendering PDF", completeAt: 92 },
  { label: "Finalising & compressing", completeAt: 99 },
];

export default function ResumeEditorPage() {
  const router = useRouter();
  const { payload, clearPayload } = useResumeEditStore();

  /* ── Redirect if no payload in store ────────────────────────── */
  useEffect(() => {
    if (!payload) {
      router.replace("/resume-builder");
    }
  }, [payload, router]);

  /* ── Form ────────────────────────────────────────────────────── */
  const { register, control, getValues, setValue, reset } =
    useForm<BuildResume>({
      defaultValues: payload ?? undefined,
    });

  // Sync form if the store payload changes after mount
  useEffect(() => {
    if (payload) reset(payload);
  }, [payload, reset]);

  /* ── Left panel (form) collapsed state ───────────────────────── */
  const [formPanelOpen, setFormPanelOpen] = useState(false);

  /* ── Live preview with 600 ms debounce ───────────────────────── */
  const watchedValues = useWatch({ control }) as BuildResume;
  const [previewData, setPreviewData] = useState<BuildResume>(
    payload ?? ({} as BuildResume),
  );
  // Only show "updating" badge after the user has made their first change
  const [previewUpdating, setPreviewUpdating] = useState(false);
  const hasInteracted = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip the initial render — form values haven't changed yet
    if (!hasInteracted.current) {
      hasInteracted.current = true;
      return;
    }
    setPreviewUpdating(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewData({ ...watchedValues } as BuildResume);
      setPreviewUpdating(false);
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [watchedValues]);

  /* ── Download progress ───────────────────────────────────────── */
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  /* ── Handle Download ─────────────────────────────────────────── */
  const handleDownload = async () => {
    const raw = getValues() as BuildResume;

    // Strip careerScopes — hidden section, not shown in resume.
    const currentPayload: BuildResume = { ...raw, careerScopes: undefined };
    setDownloading(true);
    startProgress(95);
    try {
      const result = await generateResumeAPI(currentPayload);
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
      toast.error("Download failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setDownloading(false);
    }
  };

  /* ── Back button: clear store so stale data can't re-enter ──── */
  const handleBack = () => {
    clearPayload();
    router.push("/resume-builder");
  };

  /* ── Guard render ────────────────────────────────────────────── */
  if (!payload) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* ── Top action bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-background shrink-0 gap-4">
        {/* Left: back + toggle form + title */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-1.5"
          >
            <ArrowLeft size={14} />
            Back
          </Button>

          {/* Toggle the form panel */}
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
            {formPanelOpen ? "Hide Fields" : "Show Fields"}
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

        {/* Right: download */}
        <Button
          onClick={handleDownload}
          disabled={downloading}
          className="gap-2 shrink-0"
        >
          <Download size={15} />
          Download PDF
        </Button>
      </div>

      {/* ── Split layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — form panel (collapsible) */}
        {formPanelOpen && (
          <div className="w-[420px] shrink-0 flex flex-col border-r bg-background overflow-hidden">
            <div className="px-4 pt-4 pb-2 shrink-0">
              <p className="text-xs text-muted-foreground">
                Edit your resume details below. The canvas updates automatically.
              </p>
            </div>
            <div className="flex-1 overflow-hidden px-4 pb-4">
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

      {/* Download loading dialog */}
      <LoadingDialog
        loading={downloading}
        title="Generating your PDF..."
        steps={DOWNLOAD_STEPS}
        progress={dlProgress}
      />
    </div>
  );
}
