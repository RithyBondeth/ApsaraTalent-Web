import { useCallback, useRef } from "react";
import { useResumeTemplateTheme } from "@/hooks/resume/use-resume-template-theme";

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
  const theme = useResumeTemplateTheme();

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
      style={{ borderRadius: theme.radius, fontFamily: "inherit", ...style }}
      className={[
        "cursor-text outline-none transition-all",
        "hover:bg-primary/5 hover:ring-1 hover:ring-primary/30",
        "focus:bg-primary/8 focus:ring-2 focus:ring-primary/50",
        "empty:before:font-[inherit] empty:before:not-italic empty:before:text-current empty:before:opacity-35 empty:before:content-[attr(data-placeholder)]",
        className,
      ].join(" ")}
    >
      {value}
    </Tag>
  );
}
