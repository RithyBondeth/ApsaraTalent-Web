import { useCallback, useRef } from "react";

export function Editable(props: {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  style?: React.CSSProperties;
}) {
  /* ----------------------------------- Props --------------------------------- */
  const { value, onCommit, placeholder, className, multiline, style } = props;

  /* -------------------------------- All States ------------------------------- */
  const ref = useRef<(HTMLSpanElement & HTMLDivElement) | null>(null);

  /* ---------------------------------- Utils ---------------------------------- */
  const Tag = multiline ? "div" : "span";

  /* --------------------------------- Methods ---------------------------------- */
  // ── Handle Blur ─────────────────────────────────────────
  const handleBlur = useCallback(() => {
    if (!ref.current) return;
    const text = ref.current.innerText.trim();
    if (text !== value) onCommit(text);
  }, [value, onCommit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      contentEditable
      suppressContentEditableWarning
      data-canvas-editable="true"
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-placeholder={placeholder}
      style={style}
      className={[
        "outline-none rounded-sm cursor-text transition-all",
        "hover:ring-1 hover:ring-primary/30 hover:bg-primary/5",
        "focus:ring-2 focus:ring-primary/50 focus:bg-primary/8",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:italic",
        className,
      ].join(" ")}
    >
      {value}
    </Tag>
  );
}
