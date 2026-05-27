import { IMissingCardProps } from "./props";
import { useTranslations } from "next-intl";
import { LucideBookOpen } from "lucide-react";

/* ----------------------------- Helpers ----------------------------- */
const CRITICALITY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
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
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm px-4 py-4 flex flex-col gap-2.5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Skill Name and Criticality Badge Section */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-foreground leading-snug">
          {skill}
        </p>
        <span
          className={`shrink-0 inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${chipColor}`}
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
      <div className="rounded-xl bg-primary/5 border border-primary/10 px-3 py-2.5 flex gap-2">
        <LucideBookOpen className="size-3.5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">
            {t("learningTip")}
          </p>
          <p className="text-xs text-foreground/80 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  );
}
