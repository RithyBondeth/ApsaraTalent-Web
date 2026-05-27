"use client";

import { useRef, useState } from "react";
import { useCoverLetterPdfStore } from "@/stores/apis/resume/cover-letter-pdf.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideFileText,
  LucideCopy,
  LucideCheck,
  LucideRotateCcw,
  LucideDownload,
  LucideLoader2,
  LucideSparkles,
} from "lucide-react";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import {
  API_RESUME_COVER_LETTER_STREAM_URL,
  API_RESUME_POLISH_COVER_LETTER_STREAM_URL,
} from "@/utils/constants/apis/resume.api.constant";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Types                                                                */
/* ------------------------------------------------------------------ */
type TCoverLetterStyle = "classic" | "modern" | "minimal" | "bold";

const STYLES: { id: TCoverLetterStyle; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
];

/* ------------------------------------------------------------------ */
/*  Props                                                                */
/* ------------------------------------------------------------------ */
interface Props {
  employeeName: string;
  employeeJob?: string;
  employeeSkills: string[];
  employeeExperience?: string;
  employeeDescription?: string;
  companyName: string;
  companyIndustry?: string;
  companyDescription?: string;
  openPositions: string[];
  /** When true the trigger shows icon-only on mobile (< sm) and full label on sm+. */
  compact?: boolean;
}

export function AiCoverLetterModal(props: Props) {
  const t = useTranslations("matching");

  /* ------------------------------------------------------------------ */
  /*  API                                                                  */
  /* ------------------------------------------------------------------ */
  const { generateCoverLetterPdf } = useCoverLetterPdfStore();

  /* ------------------------------------------------------------------ */
  /*  State                                                                */
  /* ------------------------------------------------------------------ */
  const [open, setOpen] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const [polishing, setPolishing] = useState(false);
  const [polishError, setPolishError] = useState<string | null>(null);

  const [selectedStyle, setSelectedStyle] =
    useState<TCoverLetterStyle>("classic");
  const [copied, setCopied] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBusy = generating || polishing || downloading;

  /* ------------------------------------------------------------------ */
  /*  Progress helpers                                                     */
  /* ------------------------------------------------------------------ */
  const startProgress = (cap = 92) => {
    setDlProgress(0);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      const increment = Math.max(0.5, (cap - current) * 0.04);
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

  /* ------------------------------------------------------------------ */
  /*  Generate (streaming)                                                 */
  /* ------------------------------------------------------------------ */
  const generate = async () => {
    setOpen(true);
    if (coverLetter) return;
    setGenerating(true);
    setGenError(null);
    setPolishError(null);
    setCoverLetter(""); // show textarea immediately so text streams into it

    await streamFetch(
      API_RESUME_COVER_LETTER_STREAM_URL,
      {
        method: "POST",
        body: {
          employeeName: props.employeeName,
          employeeJob: props.employeeJob,
          employeeSkills: props.employeeSkills,
          employeeExperience: props.employeeExperience,
          employeeDescription: props.employeeDescription,
          companyName: props.companyName,
          companyIndustry: props.companyIndustry,
          companyDescription: props.companyDescription,
          openPositions: props.openPositions,
        },
      },
      (event) => {
        if (event.t === "chunk") {
          setCoverLetter((prev) => (prev ?? "") + event.v);
        } else if (event.t === "error") {
          setGenError(t("coverLetterFailed"));
          setCoverLetter(null);
        }
      },
    );

    setGenerating(false);
  };

  const handleRegenerate = () => {
    setCoverLetter(null);
    setPolishError(null);
    generate();
  };

  /* ------------------------------------------------------------------ */
  /*  Polish (streaming)                                                   */
  /* ------------------------------------------------------------------ */
  const handlePolish = async () => {
    if (!coverLetter) return;
    setPolishing(true);
    setPolishError(null);
    const originalText = coverLetter;
    setCoverLetter(""); // clear and stream polished version in

    await streamFetch(
      API_RESUME_POLISH_COVER_LETTER_STREAM_URL,
      { method: "POST", body: { coverLetterText: originalText } },
      (event) => {
        if (event.t === "chunk") {
          setCoverLetter((prev) => (prev ?? "") + event.v);
        } else if (event.t === "error") {
          setPolishError(t("polishFailed"));
          setCoverLetter(originalText); // restore on error
        }
      },
    );

    setPolishing(false);
  };

  /* ------------------------------------------------------------------ */
  /*  Copy                                                                 */
  /* ------------------------------------------------------------------ */
  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ------------------------------------------------------------------ */
  /*  Download PDF                                                         */
  /* ------------------------------------------------------------------ */
  const handleDownloadPdf = async () => {
    if (!coverLetter) return;
    setDownloading(true);
    startProgress(92);
    try {
      const res = await generateCoverLetterPdf({
        employeeName: props.employeeName,
        employeeJob: props.employeeJob,
        companyName: props.companyName,
        companyIndustry: props.companyIndustry,
        coverLetterText: coverLetter,
        style: selectedStyle,
      });

      stopProgress(100);
      await new Promise((r) => setTimeout(r, 400));

      const { data, mimeType, filename } = res;
      const bytes = new Uint8Array(
        Array.from(atob(data), (c) => c.charCodeAt(0)),
      );
      const blob = new Blob([bytes], { type: mimeType });
      const a = document.createElement("a");
      const objectUrl = window.URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename || "cover-letter.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      stopProgress(0);
    } finally {
      setDownloading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-xs gap-1.5 px-2.5 sm:px-3"
        onClick={generate}
      >
        <LucideFileText className="size-3.5 text-primary shrink-0" />
        <span className={props.compact ? "hidden sm:inline" : undefined}>
          {t("coverLetter")}
        </span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[78dvh]">
          {/* Header */}
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base text-left pr-8">
              <LucideFileText className="size-4 text-primary shrink-0" />
              <span className="truncate">
                {t("aiCoverLetter", { name: props.companyName })}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Style selector */}
          <div className="shrink-0 px-5 pt-3 pb-2.5 border-b border-border/50 flex items-center gap-2.5 overflow-x-auto scrollbar-none bg-background">
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {t("styleLabel")}
            </span>
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                disabled={isBusy}
                className={`text-xs px-3 py-1 rounded-full border transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedStyle === s.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col px-5 py-4 gap-2 overscroll-contain">
            {/* Error */}
            {genError && !generating && (
              <p className="text-sm text-destructive shrink-0">{genError}</p>
            )}

            {/* Textarea — visible as soon as coverLetter is non-null (even empty string during stream) */}
            {coverLetter !== null && (
              <>
                <textarea
                  value={coverLetter}
                  onChange={(e) => {
                    setCoverLetter(e.target.value);
                    setPolishError(null);
                  }}
                  disabled={generating || polishing || downloading}
                  readOnly={generating || polishing}
                  spellCheck={!generating && !polishing}
                  className="flex-1 min-h-0 w-full resize-none bg-transparent text-sm text-foreground leading-relaxed outline-none border-0 focus:ring-0 p-0 overflow-y-auto scrollbar-none disabled:opacity-60 disabled:cursor-not-allowed"
                />

                {/* Streaming cursor */}
                {(generating || polishing) && (
                  <div className="flex items-center gap-2 text-xs text-primary shrink-0">
                    <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
                    <span>
                      {polishing
                        ? t("polishing")
                        : t("generating") || "Generating…"}
                    </span>
                  </div>
                )}

                {polishError && !polishing && (
                  <p className="text-xs text-destructive shrink-0">
                    {polishError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
            {generating && !coverLetter ? (
              <>
                <Skeleton className="h-7 w-24 rounded-md" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-16 rounded-md" />
                  <Skeleton className="size-7 rounded-md" />
                  <Skeleton className="h-7 w-28 rounded-md" />
                </div>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5 shrink-0"
                  onClick={handleRegenerate}
                  disabled={isBusy}
                >
                  <LucideRotateCcw className="size-3.5" />
                  <span className="hidden sm:inline lg:hidden">Redo</span>
                  <span className="hidden lg:inline">{t("regenerate")}</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1.5 shrink-0"
                    onClick={handlePolish}
                    disabled={!coverLetter || isBusy}
                  >
                    {polishing ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideSparkles className="size-3.5 text-primary" />
                    )}
                    <span className="hidden sm:inline lg:hidden">
                      {polishing ? "…" : "Fix"}
                    </span>
                    <span className="hidden lg:inline">
                      {polishing ? t("polishing") : t("polish")}
                    </span>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 size-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                    disabled={!coverLetter || isBusy}
                    title={copied ? t("copied") : t("copy")}
                  >
                    {copied ? (
                      <LucideCheck className="size-3.5 text-green-500" />
                    ) : (
                      <LucideCopy className="size-3.5" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5 shrink-0"
                    onClick={handleDownloadPdf}
                    disabled={!coverLetter || isBusy}
                  >
                    {downloading ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideDownload className="size-3.5" />
                    )}
                    <span className="hidden sm:inline lg:hidden">
                      {downloading ? "…" : "PDF"}
                    </span>
                    <span className="hidden lg:inline">
                      {downloading ? t("downloadingPdf") : t("downloadPdf")}
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <LoadingDialog
        loading={downloading}
        title={t("coverLetterPdfGenerating")}
        steps={[
          { label: t("coverLetterPdfStep1"), completeAt: 20 },
          { label: t("coverLetterPdfStep2"), completeAt: 50 },
          { label: t("coverLetterPdfStep3"), completeAt: 80 },
          { label: t("coverLetterPdfStep4"), completeAt: 96 },
        ]}
        progress={dlProgress}
      />
    </>
  );
}

export default AiCoverLetterModal;
