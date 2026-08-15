import { IMissingCardProps } from "./props";
import { useTranslations } from "next-intl";
import { LucideBookOpen } from "lucide-react";

/* ----------------------------- Helper ------------------------------ */
/* Criticality is a severity — status tokens, not raw hues. Each resolves per
 * theme on its own, so no `dark:` twin is needed alongside. */
const CRITICALITY_COLOR: Record<string, string> = {
  high: "bg-destructive-subtle text-destructive-accent",
  medium: "bg-warning-subtle text-warning-accent",
  low: "bg-info-subtle text-info-accent",
};

export default function MissingCard(props: IMissingCardProps) {
  /* ----------------------------- Props ----------------------------- */
  const { skill, criticality, positions, tip } = props;

  /* ----------------------------- Utils ----------------------------- */
  const t = useTranslations("matching");
  const chipColor =
    CRITICALITY_COLOR[criticality] ?? "bg-muted text-muted-foreground";
  const critLabel =
    criticality === "high"
      ? t("criticalityHigh")
      : criticality === "medium"
        ? t("criticalityMedium")
        : t("criticalityLow");

  /* --------------------------- Render UI -------------------------- */
  return (
    <div className="flex flex-col gap-2.5 rounded-none border border-l-[5px] border-border border-l-foreground bg-card px-4 py-4 shadow-[4px_4px_0_hsl(var(--foreground)/0.05)] duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
      {/* Skill Name and Criticality Badge Section */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {skill}
        </p>
        <span
          className={`border-current/15 inline-flex shrink-0 rounded-none border px-2.5 py-0.5 text-[11px] font-semibold ${chipColor}`}
        >
          {critLabel}
        </span>
      </div>

      {/* Position Section */}
      {positions.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">{t("neededFor")}:</span>{" "}
          {positions.join(", ")}
        </p>
      )}

      {/* Learning Tip Section */}
      <div className="flex gap-2 rounded-none border border-l-[4px] border-primary/10 border-l-primary bg-primary/5 px-3 py-2.5">
        <LucideBookOpen className="mt-0.5 size-3.5 shrink-0 text-primary" />
        <div>
          <p className="pixel-label mb-1 text-primary">{t("learningTip")}</p>
          <p className="text-xs leading-relaxed text-foreground/80">{tip}</p>
        </div>
      </div>
    </div>
  );
}
