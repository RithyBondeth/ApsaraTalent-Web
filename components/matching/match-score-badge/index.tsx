import { SCORE_COLOR } from "@/utils/constants/ui.constant";
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

  const color =
    props.score >= 75
      ? SCORE_COLOR.HIGH
      : props.score >= 50
        ? SCORE_COLOR.MEDIUM
        : SCORE_COLOR.LOW;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className="pixel-numeral inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 text-xs font-medium"
      style={{ color, borderColor: color }}
      title={t("matchScoreHint")}
      aria-label={t("matchScoreLabel", { score: props.score })}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {t("matchScoreValue", { score: props.score })}
    </span>
  );
}
