import { cn } from "@/lib/utils";
import { IThemeCardProps } from "./props";
import { LucideCheck } from "lucide-react";
import type { CSSProperties } from "react";

/* Which theme each preview depicts. "system" shows both halves, so it takes the
 * light surfaces and overlays a dark corner via the gradient below. */
const PREVIEW_SURFACE: Record<string, CSSProperties> = {
  dark: {
    "--pv-bg": "var(--preview-dark-bg)",
    "--pv-surface": "var(--preview-dark-surface)",
    "--pv-line": "var(--preview-dark-line)",
  } as CSSProperties,
  light: {
    "--pv-bg": "var(--preview-light-bg)",
    "--pv-surface": "var(--preview-light-surface)",
    "--pv-line": "var(--preview-light-line)",
  } as CSSProperties,
  system: {
    "--pv-bg": "var(--preview-light-bg)",
    "--pv-surface": "var(--preview-dark-surface)",
    "--pv-line": "var(--preview-light-line)",
  } as CSSProperties,
};

export function ThemeCard(props: IThemeCardProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { value, label, icon, active, onClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center gap-2 border-2 p-3 text-left transition-all duration-200",
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {/* Mini Window Preview Section
          The one component that must not follow the theme — a dark preview has
          to read as dark while you are looking at it in light mode. It draws
          from the --preview-* tokens, which mirror each theme's real surfaces
          and are deliberately never redefined in .dark. */}
      <div
        style={PREVIEW_SURFACE[value]}
        className="flex h-14 w-full flex-col gap-1 overflow-hidden border border-[hsl(var(--pv-line))] bg-[hsl(var(--pv-bg))] p-1.5"
      >
        <div className="h-1.5 w-3/4 bg-[hsl(var(--pv-line))]" />
        <div className="h-1 w-1/2 bg-[hsl(var(--pv-line))]" />
        <div className="mt-0.5 flex gap-1">
          <div className="h-3 flex-1 bg-[hsl(var(--pv-surface))]" />
          <div className="h-3 flex-1 bg-[hsl(var(--pv-surface))]" />
        </div>
      </div>

      {/* Label Section */}
      <div className="flex items-center justify-center gap-1.5">
        <span
          className={cn(
            "[&>svg]:size-3.5",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {/* Active Checkmark Section */}
      {active && (
        <span className="absolute right-2 top-2 flex size-4 items-center justify-center bg-primary">
          <LucideCheck
            className="size-2.5 text-primary-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}
