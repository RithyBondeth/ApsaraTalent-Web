"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useDownloadProgress } from "@/hooks/utils/use-download-progress";
import { downloadBase64File } from "@/utils/functions/file";
import { MODAL_ANIMATION_DELAY_MS } from "@/utils/constants/config.constant";
import { useInterviewPrepPdfStore } from "@/stores/apis/resume/interview-prep-pdf.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LucideMessageCircleQuestion,
  LucideRotateCcw,
  LucideAlertCircle,
  LucideDownload,
  LucideLoader2,
} from "lucide-react";
import { API_AI_INTERVIEW_PREP_STREAM_URL } from "@/utils/constants/apis/matching.api.constant";
import { IAiInterviewPrepQuestion } from "@/utils/interfaces/resume";
import { streamFetch } from "@/utils/functions/network";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { useTranslations } from "next-intl";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { QuestionCard } from "./question-card";
import { IAiInterviewPrepModalProps } from "./props";

export function AiInterviewPrepModal(props: IAiInterviewPrepModalProps) {
  /* ---------------------------- Props --------------------------- */
  const { eid, cid, companyName, interviewTitle, autoOpen } = props;

  /* ---------------------------- Utils --------------------------- */
  const t = useTranslations("matching");

  /* -------------------------- All States ------------------------ */
  const [open, setOpen] = useState<boolean>(false);
  /** Questions streamed in so far */
  const [questions, setQuestions] = useState<IAiInterviewPrepQuestion[]>([]);
  /** True while the SSE stream is active */
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const autoOpenRef = useRef<boolean>(autoOpen ?? false);

  const [downloading, setDownloading] = useState<boolean>(false);
  const {
    progress: dlProgress,
    start: startProgress,
    stop: stopProgress,
  } = useDownloadProgress();

  /* ----------------------- API Integration ----------------------- */
  const { generateInterviewPrepPdf } = useInterviewPrepPdfStore();

  /* -------------------------- Effects -------------------------- */
  useEffect(() => {
    if (!autoOpenRef.current) return;
    autoOpenRef.current = false;
    triggerRef.current?.click();
  }, []);

  /* --------------------------- Methods --------------------------- */
  // ── Handle Stream Questions ──────────────────────
  const streamPrep = async () => {
    setOpen(true);
    setGenerating(true);
    setError(null);
    setQuestions([]);

    const url = API_AI_INTERVIEW_PREP_STREAM_URL(eid, cid);
    const fullUrl = interviewTitle
      ? `${url}?interviewTitle=${encodeURIComponent(interviewTitle)}`
      : url;

    // Accumulate raw text chunks and parse complete NDJSON lines client-side.
    // This reuses the proven pipe() SSE infrastructure (same as cover letter streaming).
    let lineBuffer = "";
    const received: IAiInterviewPrepQuestion[] = [];

    const tryParseLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      try {
        const q = JSON.parse(trimmed);
        if (q.question && q.tip) {
          received.push({
            question: q.question,
            questionKm: q.questionKm ?? "",
            category: q.category ?? "General",
            tip: q.tip,
            tipKm: q.tipKm ?? "",
          });
          // flushSync forces an immediate re-render for each question,
          // bypassing React 18's automatic batching.
          flushSync(() => setQuestions([...received]));
        }
      } catch {}
    };

    try {
      await streamFetch(fullUrl, { method: "GET" }, (event) => {
        if (event.t === "chunk") {
          lineBuffer += event.v;
          const lines = lineBuffer.split("\n");
          lineBuffer = lines.pop() ?? ""; // keep the last (possibly incomplete) line
          lines.forEach(tryParseLine);
        } else if (event.t === "done") {
          tryParseLine(lineBuffer); // flush any remaining content
        } else if (event.t === "error") {
          console.warn("[InterviewPrep] Stream error:", event.v);
          // Surface the server's message when the AI quota / rate limit is hit.
          setError(event.code === 429 ? event.v : t("interviewPrepFailed"));
        }
      });
    } catch (err) {
      console.warn("[InterviewPrep] Fetch failed:", err);
      setError(t("interviewPrepFailed"));
    }

    setGenerating(false);
  };

  // ── Handle Open Modal ───────────────────────────
  const handleOpen = () => {
    if (questions.length > 0 && !generating) {
      setOpen(true);
      return;
    }
    streamPrep();
  };

  // ── Handle Regenerate ───────────────────────────
  const handleRegenerate = () => {
    setQuestions([]);
    streamPrep();
  };

  // ── Handle Download PDF ───────────────────────────
  const handleDownloadPdf = async () => {
    if (!questions.length) return;
    setDownloading(true);
    startProgress(92);
    try {
      const res = await generateInterviewPrepPdf({
        interviewTitle: interviewTitle ?? "Interview Prep",
        companyName,
        questions,
      });
      stopProgress(100);
      await new Promise((r) => setTimeout(r, MODAL_ANIMATION_DELAY_MS));
      const { data: b64, mimeType, filename } = res;
      downloadBase64File(b64, mimeType, filename || "interview-prep.pdf");
    } catch {
      stopProgress(0);
    } finally {
      setDownloading(false);
    }
  };

  /* ------------------------------ Computed States ------------------------------ */
  const isBusy = generating || downloading;
  const hasQuestions = questions.length > 0;

  /* --------------------------------- Render UI --------------------------------- */
  return (
    <>
      {/* Button To Open Modal Section */}
      <Button
        ref={triggerRef}
        size="sm"
        variant="outline"
        className="gap-1.5 rounded-none text-xs"
        onClick={handleOpen}
      >
        <LucideMessageCircleQuestion className="size-3.5 text-primary" />
        {t("interviewPrep")}
      </Button>

      {/* Modal Section */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent variant="flush" size="xl">
          {/* Header Section */}
          <DialogHeader className="shrink-0 border-b border-border/60 px-5 pb-4 pt-5">
            <div className="flex items-center gap-3 pr-8">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-none bg-foreground">
                <LucideMessageCircleQuestion className="size-5 text-background" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-left text-base font-semibold leading-tight">
                  {interviewTitle ??
                    t("aiInterviewPrep", { name: companyName })}
                </DialogTitle>
                {interviewTitle && (
                  <p className="mt-0.5 truncate text-start text-xs text-muted-foreground">
                    {companyName}
                  </p>
                )}
              </div>
              {hasQuestions && (
                <span className="shrink-0 rounded-none border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {generating
                    ? t("questionsBadgeSoFar", { count: questions.length })
                    : t("questionsBadge", { count: questions.length })}
                </span>
              )}
            </div>
            {/* AI Quota Badge Section */}
            <div className="mt-3">
              <AiQuotaBadge />
            </div>
          </DialogHeader>

          {/* Scrollable Body Section */}
          <div className="max-h-[58vh] space-y-3 overflow-y-auto overscroll-contain px-5 py-4">
            {/* Full Skeleton Section: While Streaming AND No Questions Yet */}
            {generating &&
              !hasQuestions &&
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-none border border-border bg-card px-4 py-4"
                >
                  <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-none" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24 rounded-none" />
                    <Skeleton className="h-4 w-full rounded-none" />
                    <Skeleton
                      className={`h-4 rounded-none ${i % 2 === 0 ? "w-4/5" : "w-3/4"}`}
                    />
                    <Skeleton className="h-3 w-2/3 rounded-none" />
                  </div>
                </div>
              ))}

            {/* Error Section (Only Shown if No Questions At All) */}
            {error && !generating && !hasQuestions && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-none border border-destructive/20 bg-destructive/10">
                  <LucideAlertCircle className="size-7 text-destructive/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("somethingWentWrong")}
                  </p>
                  <p className="mt-1 max-w-[280px] text-sm text-muted-foreground">
                    {error}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 rounded-none"
                  onClick={handleRegenerate}
                >
                  <LucideRotateCcw className="size-3.5" />
                  {t("tryAgain")}
                </Button>
              </div>
            )}

            {/* Questions Section (Progressively Revealed As The Stream Arrives) */}
            {hasQuestions &&
              questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  item={q}
                  index={i}
                  tipLabel={t("answerTip")}
                />
              ))}

            {/* Subtle Section: "Generating More..." Indicator When Streaming With Questions */}
            {generating && hasQuestions && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-primary">
                <LucideLoader2 className="size-3.5 shrink-0 animate-spin" />
                <span>{t("generatingMoreQuestions")}</span>
              </div>
            )}
          </div>

          {/* Footer Section */}
          {!error && (
            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border/60 bg-muted/20 px-5 py-4">
              {generating && !hasQuestions ? (
                <>
                  <Skeleton className="h-9 w-36 rounded-none" />
                  <Skeleton className="h-9 w-36 rounded-none" />
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-none"
                    onClick={handleRegenerate}
                    disabled={isBusy}
                  >
                    <LucideRotateCcw className="size-3.5" />
                    {t("regenerateQuestions")}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-none"
                    onClick={handleDownloadPdf}
                    disabled={!hasQuestions || isBusy}
                  >
                    {downloading ? (
                      <LucideLoader2 className="size-3.5 animate-spin" />
                    ) : (
                      <LucideDownload className="size-3.5" />
                    )}
                    {downloading
                      ? t("downloadingPrepPdf")
                      : t("downloadPrepPdf")}
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Loading Dialog Section */}
      <LoadingDialog
        loading={downloading}
        title={t("interviewPrepPdfGenerating")}
        steps={[
          { label: t("interviewPrepPdfStep1"), completeAt: 20 },
          { label: t("interviewPrepPdfStep2"), completeAt: 50 },
          { label: t("interviewPrepPdfStep3"), completeAt: 80 },
          { label: t("interviewPrepPdfStep4"), completeAt: 96 },
        ]}
        progress={dlProgress}
      />
    </>
  );
}
