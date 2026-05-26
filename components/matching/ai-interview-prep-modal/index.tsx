"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
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
  LucideLightbulb,
  LucideDownload,
  LucideLoader2,
} from "lucide-react";
import { API_AI_INTERVIEW_PREP_STREAM_URL } from "@/utils/constants/apis/matching.api.constant";
import { IAiInterviewPrepQuestion } from "@/utils/interfaces/resume";
import { streamFetch } from "@/utils/functions/stream-fetch";
import { useTranslations } from "next-intl";
import LoadingDialog from "@/components/utils/dialogs/loading-dialog";

/* ------------------------------------------------------------------ */
/*  Category chip colours                                                */
/* ------------------------------------------------------------------ */
const CHIP: Record<string, string> = {
  Technical: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Behavioral:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  Situational:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "Culture Fit":
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};
const CHIP_FALLBACK = "bg-muted text-muted-foreground";

/* ------------------------------------------------------------------ */
/*  Single question card                                                  */
/* ------------------------------------------------------------------ */
function QuestionCard({
  item,
  index,
  tipLabel,
}: {
  item: IAiInterviewPrepQuestion;
  index: number;
  tipLabel: string;
}) {
  const chip = CHIP[item.category] ?? CHIP_FALLBACK;

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden px-4 py-4 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Question */}
      <div className="flex gap-3">
        <span className="shrink-0 text-xs font-semibold text-muted-foreground/50 w-5 text-right leading-5 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1">
          <span
            className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2 ${chip}`}
          >
            {item.category}
          </span>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {item.question}
          </p>
          {item.questionKm && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {item.questionKm}
            </p>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="ml-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 px-4 py-3">
        <div className="flex gap-2.5">
          <LucideLightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">
              {tipLabel}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {item.tip}
            </p>
            {item.tipKm && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-amber-100 dark:border-amber-800/30">
                {item.tipKm}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                                */
/* ------------------------------------------------------------------ */
interface Props {
  eid: string;
  cid: string;
  companyName: string;
  interviewTitle?: string;
}

/* ------------------------------------------------------------------ */
/*  Modal                                                                */
/* ------------------------------------------------------------------ */
export function AiInterviewPrepModal({
  eid,
  cid,
  companyName,
  interviewTitle,
}: Props) {
  const t = useTranslations("matching");

  /* ------------------------------------------------------------------ */
  /*  API                                                                  */
  /* ------------------------------------------------------------------ */
  const { generateInterviewPrepPdf } = useInterviewPrepPdfStore();

  const [open, setOpen] = useState(false);
  /** Questions streamed in so far */
  const [questions, setQuestions] = useState<IAiInterviewPrepQuestion[]>([]);
  /** True while the SSE stream is active */
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* stream ----------------------------------------------------------- */
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
      } catch {
        // Incomplete JSON fragment — wait for more chunks
      }
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
          setError(t("interviewPrepFailed"));
        }
      });
    } catch (err) {
      console.warn("[InterviewPrep] Fetch failed:", err);
      setError(t("interviewPrepFailed"));
    }

    setGenerating(false);
  };

  const handleOpen = () => {
    if (questions.length > 0 && !generating) {
      setOpen(true);
      return;
    }
    streamPrep();
  };

  const handleRegenerate = () => {
    setQuestions([]);
    streamPrep();
  };

  /* pdf -------------------------------------------------------------- */
  const startProgress = (cap = 92) => {
    setDlProgress(0);
    let current = 0;
    progressTimerRef.current = setInterval(() => {
      const inc = Math.max(0.5, (cap - current) * 0.04);
      current = Math.min(cap, current + inc);
      setDlProgress(current);
      if (current >= cap) clearInterval(progressTimerRef.current!);
    }, 300);
  };

  const stopProgress = (v = 100) => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    setDlProgress(v);
  };

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
      await new Promise((r) => setTimeout(r, 400));
      const { data: b64, mimeType, filename } = res;
      const bytes = new Uint8Array(
        Array.from(atob(b64), (c) => c.charCodeAt(0)),
      );
      const blob = new Blob([bytes], { type: mimeType });
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename || "interview-prep.pdf";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      stopProgress(0);
    } finally {
      setDownloading(false);
    }
  };

  const isBusy = generating || downloading;
  const hasQuestions = questions.length > 0;

  /* render ----------------------------------------------------------- */
  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="text-xs gap-1.5"
        onClick={handleOpen}
      >
        <LucideMessageCircleQuestion className="size-3.5 text-primary" />
        {t("interviewPrep")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl flex flex-col p-0 gap-0">
          {/* ── Header ─────────────────────────────────────────────── */}
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
          </DialogHeader>

          {/* ── Scrollable body ─────────────────────────────────────── */}
          <div className="overflow-y-auto overscroll-contain max-h-[58vh] px-5 py-4 space-y-3">
            {/* Full skeleton — while streaming AND no questions yet */}
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

            {/* Error (only shown if no questions at all) */}
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

            {/* Questions (progressively revealed as the stream arrives) */}
            {hasQuestions &&
              questions.map((q, i) => (
                <QuestionCard
                  key={i}
                  item={q}
                  index={i}
                  tipLabel={t("answerTip")}
                />
              ))}

            {/* Subtle "generating more..." indicator when streaming with questions */}
            {generating && hasQuestions && (
              <div className="flex items-center gap-2 py-2 px-4 text-xs text-primary">
                <LucideLoader2 className="size-3.5 animate-spin shrink-0" />
                <span>{t("generatingMoreQuestions")}</span>
              </div>
            )}
          </div>

          {/* ── Footer ─────────────────────────────────────────────── */}
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

export default AiInterviewPrepModal;
