"use client";

import { useEffect, useState } from "react";
import { HOOK_TEXT_SELECTION_HIDDEN_STATE } from "@/utils/constants/ui.constant";

/* ---------------------------------- Usage ----------------------------------- */
/**
 * Tracks the current text selection inside any element marked
 * `data-canvas-editable` and returns its position and formatting state.
 *
 * Usage:
 *   const { isVisible, top, left, isBold, isItalic } = useTextSelection();
 *
 *   // Show a floating toolbar when text is selected
 *   {isVisible && (
 *     <Toolbar style={{ top, left }} isBold={isBold} isItalic={isItalic} />
 *   )}
 *
 *   // Mark editable areas so the hook picks up selections inside them:
 *   <div data-canvas-editable contentEditable>...</div>
 */

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

/* ----------------------------------- Hook ------------------------------------ */
export function useTextSelection(): TextSelectionState {
  /* -------------------------------- All States ------------------------------- */
  const [state, setState] = useState<TextSelectionState>(
    HOOK_TEXT_SELECTION_HIDDEN_STATE,
  );

  /* --------------------------------- Effects --------------------------------- */
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
  return state;
}
