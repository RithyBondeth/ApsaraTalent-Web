"use client";

import { useEffect, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
export interface TextSelectionState {
  isVisible: boolean;
  /** screen-space top in px — place toolbar above selection */
  top: number;
  /** screen-space horizontal center in px */
  left: number;
  isBold: boolean;
  isItalic: boolean;
}

const HIDDEN: TextSelectionState = {
  isVisible: false,
  top: 0,
  left: 0,
  isBold: false,
  isItalic: false,
};

/* ─── Hook ──────────────────────────────────────────────────── */
/**
 * Tracks `window.getSelection()` and returns position + formatting
 * state whenever text inside `[data-canvas-editable]` is selected.
 */
export function useTextSelection(): TextSelectionState {
  /* --------------------------------- All States -------------------------------- */
  const [state, setState] = useState<TextSelectionState>(HIDDEN);

  /* ---------------------------------- Effects --------------------------------- */ useEffect(() => {
    function handleSelectionChange() {
      const sel = window.getSelection();

      // No selection or collapsed (just a cursor)
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setState(HIDDEN);
        return;
      }

      // Only activate when inside a canvas-editable element
      const anchor = sel.anchorNode?.parentElement;
      if (!anchor?.closest("[data-canvas-editable]")) {
        setState(HIDDEN);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0) {
        setState(HIDDEN);
        return;
      }

      setState({
        isVisible: true,
        // 44px toolbar height + 6px gap above the selection
        top: rect.top - 50,
        left: rect.left + rect.width / 2,
        isBold: document.queryCommandState("bold"),
        isItalic: document.queryCommandState("italic"),
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  /* ---------------------------------- Return ---------------------------------- */
  return state;
}
