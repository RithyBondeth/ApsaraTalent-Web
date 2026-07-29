"use client";

import { useEffect, useRef, useState } from "react";
import { useCoverLetterPdfStore } from "@/stores/apis/resume/cover-letter-pdf.store";
import { useDownloadProgress } from "@/hooks/utils/use-download-progress";
import { downloadBase64File } from "@/utils/functions/file";
import {
  COPY_FEEDBACK_TIMEOUT_MS,
  MODAL_ANIMATION_DELAY_MS,
} from "@/utils/constants/config.constant";
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
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { useTranslations } from "next-intl";
import { IAiCoverLetterModalProps } from "./props";
import {
  COVER_LETTER_STYLES,
  TCoverLetterStyle,
} from "@/utils/constants/matching.constant";

export function AiCoverLetterModal(props: IAiCoverLetterModalProps) {
  /* -------------------------- Utils -------------------------- */
  const t = useTranslations("matching");

  /* --------------------- API Integration --------------------- */
  const { generateCoverLetterPdf } = useCoverLetterPdfStore();

  /* ------------------------ All States ----------------------- */
  // Modal
  const [open, setOpen] = useState<boolean>(false);

  // Generate
  const [generating, setGenerating] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Polish
  const [polishing, setPolishing] = useState<boolean>(false);
  const [polishError, setPolishError] = useState<string | null>(null);

  // Style
  const [selectedStyle, setSelectedStyle] =
    useState<TCoverLetterStyle>("classic");

  // Copy
  const [copied, setCopied] = useState<boolean>(false);

  // Download
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autoOpenRef = useRef<boolean>(props.autoOpen ?? false);
  const {
    progress: dlProgress,
    start: startProgress,
    stop: stopProgress,
  } = useDownloadProgress();

  /* ---------------------- Computed State --------------------- */
  const isBusy = generating || polishing || downloading;

  useEffect(
    () => () => {
      requestController.current?.abort();
    },
    [],
  );

    /* ------------------------ Effects ------------------------ */
  useEffect(() => {
    if (!autoOpenRef.current) return;
    autoOpenRef.current = false;
    triggerRef.current?.click();
  }, []);

  /* ------------------------- Methods ------------------------- */
  // ── Handle Generate ───────────────────────────
  const generate = async (force = false) => {
    setOpen(true);
    if (coverLetter && !force) return;
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setGenerating(true);
    setGenError(null);
    setPolishError(null);
    setCoverLetter("");

    try {
      await streamFetch(
        API_RESUME_COVER_LETTER_STREAM_URL,
        {
          method: "POST",
          signal: controller.signal,
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
            setGenError(event.code === 429 ? event.v : t("coverLetterFailed"));
            setCoverLetter(null);
          }
        },
      );
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setGenError(t("coverLetterFailed"));
        setCoverLetter(null);
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
      }
      setGenerating(false);
    }
  };

  // ── Handle Regenerate ───────────────────────────
  const handleRegenerate = () => {
    setCoverLetter(null);
    setPolishError(null);
    void generate(true);
  };

  // ── Handle Polish ────────────────────────────────
  const handlePolish = async () => {
    if (!coverLetter) return;
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;
    setPolishing(true);
    setPolishError(null);
    const originalText = coverLetter;
    setCoverLetter("");

    try {
      await streamFetch(
        API_RESUME_POLISH_COVER_LETTER_STREAM_URL,
        {
          method: "POST",
          body: { coverLetterText: originalText },
          signal: controller.signal,
        },
        (event) => {
          if (event.t === "chunk") {
            setCoverLetter((prev) => (prev ?? "") + event.v);
          } else if (event.t === "error") {
            setPolishError(event.code === 429 ? event.v : t("polishFailed"));
            setCoverLetter(originalText);
          }
        },
      );
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setPolishError(t("polishFailed"));
        setCoverLetter(originalText);
      }
    } finally {
      if (requestController.current === controller) {
        requestController.current = null;
      }
      setPolishing(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen && (generating || polishing)) {
      requestController.current?.abort();
    }
  };

  // ── Handle Copy ─────────────────────────────────────
  const handleCopy = async () => {
    if (!coverLetter) return;
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_TIMEOUT_MS);
  };

  // ── Handle Download PDF ──────────────────────────────
  const handleDownloadPdf = async () => {
    if (!coverLetter) return;
    setDownloading(true);
    setDownloadError(null);
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
      await new Promise((r) => setTimeout(r, MODAL_ANIMATION_DELAY_MS));

      const { data, mimeType, filename } = res;
      downloadBase64File(data, mimeType, filename || "cover-letter.pdf");
    } catch {
      stopProgress(0);
      setDownloadError(t("coverLetterPdfFailed"));
    } finally {
      setDownloading(false);
    }
  };

  /* --------------------------------- Render UI --------------------------------- */
  return (
    <>
      {/* Button To Open The Modal Section */}
      <Button
        ref={triggerRef}
        size="sm"
        variant="outline"
        className="h-8 gap-1.5 rounded-none px-2.5 text-xs sm:px-3"
        aria-label={t("coverLetter")}
        onClick={() => void generate()}
      >
        <LucideFileText className="size-3.5 text-primary shrink-0" />
        <span className={props.compact ? "hidden sm:inline" : undefined}>
          {t("coverLetter")}
        </span>
      </Button>

      {/* Modal Section */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="h-[78dvh]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          {/* Header Section */}
          <DialogHeader className="px-5 pt-5 pb-3 shrink-0 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base text-left pr-8">
              <LucideFileText className="size-4 text-primary shrink-0" />
              <span className="truncate">
                {t("aiCoverLetter", { name: props.companyName })}
              </span>
            </DialogTitle>
            {/* AI Quota Badge Section */}
            <div className="mt-3">
              <AiQuotaBadge />
            </div>
          </DialogHeader>

          {/* Style Selector Section */}
          <div className="shrink-0 px-5 pt-3 pb-2.5 border-b border-border/50 flex items-center gap-2.5 overflow-x-auto scrollbar-none bg-background">
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {t("styleLabel")}
            </span>
            {COVER_LETTER_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyle(s.id)}
                disabled={isBusy}
                className={`text-xs px-3 py-1 rounded-none border transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedStyle === s.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col px-5 py-4 gap-2 overscroll-contain">
            {/* Error Section */}
            {genError && !generating && (
              <p className="text-sm text-destructive shrink-0">{genError}</p>
            )}

            {/* Textarea Section */}
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

                {/* Streaming Cursor Section */}
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

                {/* Polish Error Section */}
                {polishError && !polishing && (
                  <p className="text-xs text-destructive shrink-0">
                    {polishError}
                  </p>
                )}

                {downloadError && !downloading && (
                  <p className="text-xs text-destructive shrink-0">
                    {downloadError}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Footer Section */}
          <div className="shrink-0 px-4 sm:px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between gap-2">
            {generating && !coverLetter ? (
              <>
                {/* Skeleton Loader Section */}
                <Skeleton className="h-7 w-24 rounded-none" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-16 rounded-none" />
                  <Skeleton className="size-7 rounded-none" />
                  <Skeleton className="h-7 w-28 rounded-none" />
                </div>
              </>
            ) : (
              <>
                {/* Regenerate Button Section */}
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
                  {/* Polish Button Section */}
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

                  {/* Copy Button Section */}
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

                  {/* Download Button Section */}
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

      {/* Loading Dialog Section */}
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
