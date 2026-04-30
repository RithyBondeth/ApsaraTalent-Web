"use client";

import { createPortal } from "react-dom";
import { Bold, Italic, ChevronDown } from "lucide-react";
import { useTextSelection } from "@/hooks/utils/use-text-selection";
import { useEffect, useState } from "react";

/* ------------------------------------ Helpers ---------------------------------- */
// ─── Toolbar Button ─────────────────────────────
function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={[
        "flex items-center justify-center w-7 h-7 rounded transition-colors text-white",
        active ? "bg-white/25" : "hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ─── Font-Size Options ─────────────────────────────
const FONT_SIZES: string[] = [
  "10",
  "11",
  "12",
  "13",
  "14",
  "16",
  "18",
  "20",
  "24",
];

export default function FloatingToolbar() {
  /* ---------------------------------- Utils --------------------------------- */
  const { isVisible, top, left, isBold, isItalic } = useTextSelection();
  const toolbarStyle: React.CSSProperties = {
    position: "fixed",
    top: Math.max(8, top),
    left,
    transform: "translateX(-50%)",
    zIndex: 9999,
    pointerEvents: "auto",
  };

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState<boolean>(false);

  /* --------------------------------- Effects --------------------------------- */
  // Portal requires document to be available (client-only)
  useEffect(() => setMounted(true), []);

  if (!mounted || !isVisible) return null;

  /* --------------------------------- Methods --------------------------------- */
  // ── Exec ─────────────────────────────────────────
  function exec(command: string, value?: string) {
    // styleWithCSS so browsers produce <span style="..."> instead of <b>/<i>
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
  }

  // ── Apply Font Size ─────────────────────────────
  function applyFontSize(px: string) {
    // execCommand fontSize uses a 1-7 scale, so we first insert a marker
    // then replace the font element with a span that has the exact px size
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    document.execCommand("styleWithCSS", false, "true");
    // Use fontSize level 7 as a sentinel, then swap
    document.execCommand("fontSize", false, "7");
    const container = sel.anchorNode?.parentElement?.closest(
      "[data-canvas-editable]",
    );
    if (container) {
      container.querySelectorAll("font[size='7']").forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = `${px}px`;
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
    }
  }

  /* -------------------------------- Render UI -------------------------------- */
  return createPortal(
    <div
      style={toolbarStyle}
      onMouseDown={(e) => e.preventDefault()}
      className="flex items-center gap-0.5 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl px-1.5 py-1"
    >
      {/* Bold Button Section */}
      <ToolbarBtn
        active={isBold}
        onClick={() => exec("bold")}
        title="Bold (⌘B)"
      >
        <Bold size={13} strokeWidth={2.5} />
      </ToolbarBtn>

      {/* Italic Button Section */}
      <ToolbarBtn
        active={isItalic}
        onClick={() => exec("italic")}
        title="Italic (⌘I)"
      >
        <Italic size={13} strokeWidth={2.5} />
      </ToolbarBtn>

      {/* Divider Section */}
      <div className="w-px h-4 bg-gray-600 mx-0.5" />

      {/* Font size Section */}
      <div
        className="relative flex items-center gap-0.5 text-white text-xs px-1.5 h-7 rounded hover:bg-white/15 cursor-pointer"
        title="Font size"
      >
        <span className="text-gray-300 text-xs">Aa</span>
        <ChevronDown size={10} className="text-gray-400" />
        <select
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            e.preventDefault();
            applyFontSize(e.target.value);
          }}
          defaultValue=""
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        >
          <option value="" disabled>
            Size
          </option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}px
            </option>
          ))}
        </select>
      </div>
    </div>,
    document.body,
  );
}
