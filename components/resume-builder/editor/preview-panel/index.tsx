"use client";

import CanvasTemplate from "../canvas-template";
import { Eye, Files, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useResumeCanvasEditorStore } from "@/stores/apis/resume/resume-canvas-editor.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IPreviewPanelProps } from "./props";
import { useTranslations } from "next-intl";
import {
  RESUME_EDITOR_A4_WIDTH,
  RESUME_EDITOR_ZOOM_STEP,
  RESUME_EDITOR_ZOOM_MIN,
  RESUME_EDITOR_ZOOM_MAX,
} from "@/utils/constants/resume.constant";
import { estimateResumePages } from "@/utils/functions/resume";

export default function ResumeEditorPreviewPanel({
  data,
  setValue,
  getValues,
  updating,
}: IPreviewPanelProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("resumeBuilder");

  /* -------------------------------- All States ------------------------------ */
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // fitScale: the scale that makes the canvas fill the container width
  const [fitScale, setFitScale] = useState<number>(1);
  // zoomMultiplier: user-controlled multiplier on top of fitScale (1.0 = "fit")
  const [zoomMultiplier, setZoomMultiplier] = useState<number>(1);
  const [scaledHeight, setScaledHeight] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);

  /* ---------------------------------- Utils --------------------------------- */
  const scale = fitScale * zoomMultiplier;
  const zoomPercent = Math.round(scale * 100);

  // Estimated printed pages + the y-offset (natural coords) of each page break.
  const { pageCount, pageBreaks } = estimateResumePages(naturalHeight);

  const measure = useCallback(() => {
    const wrapper = scrollWrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const { width } = wrapper.getBoundingClientRect();
    if (width === 0) return;

    const newFit = Math.min((width - 24) / RESUME_EDITOR_A4_WIDTH, 1);
    setFitScale(newFit);

    // naturalHeight is the unscaled scrollHeight; multiply by current scale
    const canvasHeight = canvas.scrollHeight;
    setNaturalHeight(canvasHeight);
    setScaledHeight(canvasHeight * newFit * zoomMultiplier);
  }, [zoomMultiplier]);

  /* --------------------------------- Effects --------------------------------- */
  // Re-measure when container resizes or data changes
  useEffect(() => {
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (scrollWrapperRef.current) ro.observe(scrollWrapperRef.current);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [data, measure]);

  // Re-measure shell height whenever zoom changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setNaturalHeight(canvas.scrollHeight);
    setScaledHeight(canvas.scrollHeight * fitScale * zoomMultiplier);
  }, [zoomMultiplier, fitScale]);

  /* --------------------------------- Methods --------------------------------- */
  // ── Zoom Controls ─────────────────────────────────────────────
  const zoomIn = () =>
    setZoomMultiplier((z) =>
      Math.min(
        +(z + RESUME_EDITOR_ZOOM_STEP).toFixed(2),
        RESUME_EDITOR_ZOOM_MAX,
      ),
    );
  const zoomOut = () =>
    setZoomMultiplier((z) =>
      Math.max(
        +(z - RESUME_EDITOR_ZOOM_STEP).toFixed(2),
        RESUME_EDITOR_ZOOM_MIN,
      ),
    );
  const zoomFit = () => setZoomMultiplier(1);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex h-full flex-col">
      {/* Top Bar Section */}
      <div className="resume-editor-controls flex shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-2.5 py-2 sm:gap-3 sm:px-4">
        {/* Left Section: Title and Page Count */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground sm:text-sm">
            <Eye size={15} className="text-muted-foreground" />
            {t("resumeCanvas")}
          </div>
          {/* Page-Count Chip Section: Amber once the resume spills past one page */}
          <span
            className={cn(
              "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-medium tabular-nums transition-colors",
              pageCount > 1
                ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "border-border/60 bg-muted/50 text-muted-foreground",
            )}
            title={t("resumeCanvasPages", { count: pageCount })}
          >
            <Files size={11} />
            {t("resumeCanvasPages", { count: pageCount })}
          </span>
        </div>

        {/* Centre Section: Hint or Updating Badge */}
        <div className="flex-1 flex justify-center">
          {updating ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <RefreshCw size={11} className="animate-spin" />
              {t("updatingCanvas")}
            </div>
          ) : (
            <span className="hidden text-xs text-muted-foreground md:block">
              {t("canvasHint")}
            </span>
          )}
        </div>

        {/* Right Section: Zoom Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-transparent sm:h-7 sm:w-7"
            onClick={zoomOut}
            disabled={zoomMultiplier <= RESUME_EDITOR_ZOOM_MIN}
            title={t("zoomOut")}
          >
            <ZoomOut size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-12 rounded-none border border-border sm:h-7"
            onClick={zoomFit}
            title={t("resetToFit")}
          >
            {zoomPercent}%
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-transparent sm:h-7 sm:w-7"
            onClick={zoomIn}
            disabled={zoomMultiplier >= RESUME_EDITOR_ZOOM_MAX}
            title={t("zoomIn")}
          >
            <ZoomIn size={14} />
          </Button>
        </div>
      </div>

      {/* Scroll Wrapper Section */}
      <div
        ref={scrollWrapperRef}
        className="resume-canvas-workspace flex flex-1 items-start justify-center overflow-auto p-2.5 sm:p-6"
        onClick={() => useResumeCanvasEditorStore.getState().clearSelection()}
      >
        {/* Shell Section: Layout dimensions after CSS transform */}
        <div
          className="relative shadow-2xl shrink-0 bg-white"
          style={{
            width: RESUME_EDITOR_A4_WIDTH * scale,
            height: scaledHeight || "auto",
          }}
        >
          {/* Canvas Section: Natural A4 width, Scaled Visually */}
          <div
            ref={canvasRef}
            style={{
              width: RESUME_EDITOR_A4_WIDTH,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          >
            <CanvasTemplate
              data={data}
              setValue={setValue}
              getValues={getValues}
            />
          </div>

          {/* Page-Break Guides Section: Dashed line + label at each A4 boundary */}
          {pageBreaks.map((breakY, index) => (
            <div
              key={breakY}
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 z-10"
              style={{ top: breakY * scale }}
            >
              <div className="border-t-2 border-dashed border-amber-500/50" />
              <span className="absolute right-1 top-1 bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm">
                {t("resumeCanvasPageMarker", { number: index + 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
