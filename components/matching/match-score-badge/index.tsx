import { cn } from "@/lib/utils";
import { getScoreTone } from "@/utils/functions/ui";
import { useTranslations } from "next-intl";
import { IMatchScoreBadgeProps } from "./props";

/**
 * Compact overall-fit indicator for a match card.
 *
 * The score is a weighted blend of skills, experience, employment type, work
 * mode, languages and location — not skill overlap alone, which is reported
 * separately. Renders nothing when the API returns null, which means the two
 * profiles had no comparable fields rather than a fit of zero.
 */
export default function MatchScoreBadge(props: IMatchScoreBadgeProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const t = useTranslations("matching");

  if (props.score === null || props.score === undefined) return null;

  const tone = getScoreTone(props.score);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-none border px-2 py-1 text-xs font-bold tabular-nums",
        tone.text,
        tone.border,
      )}
      title={t("matchScoreHint")}
      aria-label={t("matchScoreLabel", { score: props.score })}
    >
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", tone.fill)}
      />
      {t("matchScoreValue", { score: props.score })}
    </span>
  );
}
