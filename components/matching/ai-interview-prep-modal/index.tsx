"use client";

import { useState } from "react";
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
import { streamFetch } from "@/utils/functions/stream-fetch";
import { AiQuotaBadge } from "@/components/utils/feedback/ai-quota-badge";
import { useTranslations } from "next-intl";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";
import { QuestionCard } from "./question-card";
import { IAiInterviewPrepModalProps } from "./props";

export function AiInterviewPrepModal(props: IAiInterviewPrepModalProps) {
  /* ---------------------------- Props --------------------------- */
  const { eid, cid, companyName, interviewTitle } = props;

  /* ---------------------------- Utils --------------------------- */
  const t = useTranslations("matching");

  /* -------------------------- All States ------------------------ */
  const [open, setOpen] = useState<boolean>(false);
  /** Questions streamed in so far */
  const [questions, setQuestions] = useState<IAiInterviewPrepQuestion[]>([]);
  /** True while the SSE stream is active */
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState<boolean>(false);
  const {
    progress: dlProgress,
    start: startProgress,
    stop: stopProgress,
  } = useDownloadProgress();

  /* ----------------------- API Integration ----------------------- */
  const { generateInterviewPrepPdf } = useInterviewPrepPdfStore();

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
        size="sm"
        variant="outline"
        className="text-xs gap-1.5"
        onClick={handleOpen}
      >
        <LucideMessageCircleQuestion className="size-3.5 text-primary" />
        {t("interviewPrep")}
      </Button>

      {/* Modal Section */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* Header Section */}
          <DialogHeader className="shrink-0 px-5 pt-5 pb-4 border-b border-border/60">
            <div className="flex items-center gap-3 pr-8">
              <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <LucideMessageCircleQuestion className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-semibold leading-tight text-left truncate">
                  {interviewTitle ??
                    t("aiInterviewPrep", { name: companyName })}
                </DialogTitle>
                {interviewTitle && (
                  <p className="text-start text-xs text-muted-foreground mt-0.5 truncate">
                    {companyName}
                  </p>
                )}
              </div>
              {hasQuestions && (
                <span className="shrink-0 text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
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
          <div className="overflow-y-auto overscroll-contain max-h-[58vh] px-5 py-4 space-y-3">
            {/* Full Skeleton Section: While Streaming AND No Questions Yet */}
            {generating &&
              !hasQuestions &&
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card px-4 py-4 flex gap-3"
                >
                  <Skeleton className="h-4 w-4 rounded shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton
                      className={`h-4 rounded ${i % 2 === 0 ? "w-4/5" : "w-3/4"}`}
                    />
                    <Skeleton className="h-3 w-2/3 rounded" />
                  </div>
                </div>
              ))}

            {/* Error Section (Only Shown if No Questions At All) */}
            {error && !generating && !hasQuestions && (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="size-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                  <LucideAlertCircle className="size-7 text-destructive/70" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("somethingWentWrong")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[280px]">
                    {error}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
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
              <div className="flex items-center gap-2 py-2 px-4 text-xs text-primary">
                <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
                <span>{t("generatingMoreQuestions")}</span>
              </div>
            )}
          </div>

          {/* Footer Section */}
          {!error && (
            <div className="shrink-0 px-5 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-between gap-3">
              {generating && !hasQuestions ? (
                <>
                  <Skeleton className="h-9 w-36 rounded-lg" />
                  <Skeleton className="h-9 w-36 rounded-lg" />
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={handleRegenerate}
                    disabled={isBusy}
                  >
                    <LucideRotateCcw className="size-3.5" />
                    {t("regenerateQuestions")}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
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

