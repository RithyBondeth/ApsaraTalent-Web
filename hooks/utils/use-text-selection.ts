"use client";

import { useEffect, useState } from "react";
import { HOOK_TEXT_SELECTION_HIDDEN_STATE } from "@/utils/constants/ui.constant";

/* ----------------------------------- Types ---------------------------------- */
export interface TextSelectionState {
  isVisible: boolean;
  /** screen-space top in px — place toolbar above selection */
  top: number;
  /** screen-space horizontal center in px */
  left: number;
  isBold: boolean;
  isItalic: boolean;
}

/* ----------------------------------- Hook ----------------------------------- */
/**
 * Tracks `window.getSelection()` and returns position + formatting
 * state whenever text inside `[data-canvas-editable]` is selected.
 */
export function useTextSelection(): TextSelectionState {
  /* -------------------------------- All States -------------------------------- */
  const [state, setState] = useState<TextSelectionState>(
    HOOK_TEXT_SELECTION_HIDDEN_STATE,
  );

  /* --------------------------------- Effects ---------------------------------- */
  useEffect(() => {
    function handleSelectionChange() {
      const sel = window.getSelection();

      // No selection or collapsed (just a cursor)
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setState(HOOK_TEXT_SELECTION_HIDDEN_STATE);
        return;
      }

      // Only activate when inside a canvas-editable element
      const anchor = sel.anchorNode?.parentElement;
      if (!anchor?.closest("[data-canvas-editable]")) {
        setState(HOOK_TEXT_SELECTION_HIDDEN_STATE);
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      if (rect.width === 0) {
        setState(HOOK_TEXT_SELECTION_HIDDEN_STATE);
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

  /* --------------------------------- Methods ---------------------------------- */
  return state;
}
