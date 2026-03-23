"use client";

import { IBuildResume } from "@/utils/interfaces/resume/resume.interface";
import CanvasTemplate from "./canvas-template";
import FloatingToolbar from "./floating-toolbar";
import { Eye, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { useEffect, useRef, useState, useCallback } from "react";
import { useCanvasEditorStore } from "@/stores/canvas-editor.store";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
  data: IBuildResume;
  setValue: UseFormSetValue<IBuildResume>;
  getValues: UseFormGetValues<IBuildResume>;
  updating?: boolean;
}

// A4 width in pixels at 96 dpi
const A4_W = 794;
// Zoom step per click (10%)
const ZOOM_STEP = 0.1;
// Min / max manual zoom multipliers relative to the auto-fit scale
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.0;

export default function ResumeEditorPreviewPanel({
  data,
  setValue,
  getValues,
  updating,
}: PreviewPanelProps) {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // fitScale: the scale that makes the canvas fill the container width
  const [fitScale, setFitScale] = useState(1);
  // zoomMultiplier: user-controlled multiplier on top of fitScale (1.0 = "fit")
  const [zoomMultiplier, setZoomMultiplier] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  const scale = fitScale * zoomMultiplier;

  /* ── Measure fit scale + shell height ────────────────────────── */
  const measure = useCallback(() => {
    const wrapper = scrollWrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const { width } = wrapper.getBoundingClientRect();
    if (width === 0) return;

    const newFit = Math.min((width - 24) / A4_W, 1);
    setFitScale(newFit);

    // naturalHeight is the unscaled scrollHeight; multiply by current scale
    const naturalHeight = canvas.scrollHeight;
    setScaledHeight(naturalHeight * newFit * zoomMultiplier);
  }, [zoomMultiplier]);

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
    setScaledHeight(canvas.scrollHeight * fitScale * zoomMultiplier);
  }, [zoomMultiplier, fitScale]);

  /* ── Zoom controls ───────────────────────────────────────────── */
  const zoomIn = () =>
    setZoomMultiplier((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), ZOOM_MAX));
  const zoomOut = () =>
    setZoomMultiplier((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), ZOOM_MIN));
  const zoomFit = () => setZoomMultiplier(1);

  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="flex flex-col h-full">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-2.5 py-2 sm:gap-3 sm:px-4 shrink-0">
        {/* Left: title */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground sm:text-sm shrink-0">
          <Eye size={15} className="text-muted-foreground" />
          Resume Canvas
        </div>

        {/* Centre: hint or updating badge */}
        <div className="flex-1 flex justify-center">
          {updating ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
              <RefreshCw size={11} className="animate-spin" />
              Updating…
            </div>
          ) : (
            <span className="hidden text-xs text-muted-foreground md:block">
              Click text to edit · Hover to add/delete · Drag to reorder
            </span>
          )}
        </div>

        {/* Right: zoom controls */}
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-7 sm:w-7"
            onClick={zoomOut}
            disabled={zoomMultiplier <= ZOOM_MIN}
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </Button>

          {/* Zoom % — click to reset to fit */}
          <button
            onClick={zoomFit}
            title="Reset to fit"
            className="min-w-[46px] text-center text-xs font-medium text-foreground tabular-nums px-1 py-0.5 rounded hover:bg-accent transition-colors"
          >
            {zoomPercent}%
          </button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-7 sm:w-7"
            onClick={zoomIn}
            disabled={zoomMultiplier >= ZOOM_MAX}
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-7 sm:w-7"
            onClick={zoomFit}
            title="Fit to window"
          >
            <Maximize2 size={13} />
          </Button>
        </div>
      </div>

      {/* ── Scroll wrapper ───────────────────────────────────────── */}
      <div
        ref={scrollWrapperRef}
        className="flex-1 overflow-auto bg-zinc-100 dark:bg-zinc-900 flex items-start justify-center p-2.5 sm:p-6"
        onClick={() => useCanvasEditorStore.getState().clearSelection()}
      >
        {/* Shell: layout dimensions after CSS transform */}
        <div
          className="relative shadow-2xl shrink-0 bg-white"
          style={{
            width: A4_W * scale,
            height: scaledHeight || "auto",
          }}
        >
          {/* Canvas: natural A4 width, scaled visually */}
          <div
            ref={canvasRef}
            style={{
              width: A4_W,
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
        </div>
      </div>

      {/* Floating text-format toolbar — portalled to document.body */}
      <FloatingToolbar />
    </div>
  );
}
