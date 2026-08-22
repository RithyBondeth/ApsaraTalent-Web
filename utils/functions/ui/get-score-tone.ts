/* --------------------------------- Method ---------------------------------- */
/**
 * Returns the token classes for a 0–100 match score.
 *
 * This replaced `SCORE_COLOR`, three raw hex values that `MatchScoreBadge` and
 * `ScoreRing` applied through `style={{ color }}`. Inline hex is invisible to
 * both guards — `check:tokens` scans class names and `check:contrast` parses
 * `globals.css` — and all three failed WCAG AA as text on a light card:
 * #22c55e at 2.28:1, #f59e0b at 2.15:1, #ef4444 at 3.76:1. Being fixed hex they
 * also could not shift for dark mode. The status `-accent` tokens are solved
 * for both themes and clear 4.9:1 or better.
 *
 * A weak match is deliberately `muted`, not destructive: a low score is not an
 * error, and rendering a person in red in a candidate feed reads far worse than
 * it scores.
 *
 * @param score - Overall fit, 0–100
 * @returns Token classes for the label, the boundary, and the dot/arc
 */
export function getScoreTone(score: number) {
  if (score >= 75) {
    return {
      text: "text-success-accent",
      border: "border-success-border",
      fill: "bg-success",
      stroke: "text-success",
    };
  }
  if (score >= 50) {
    return {
      text: "text-warning-accent",
      border: "border-warning-border",
      fill: "bg-warning",
      stroke: "text-warning",
    };
  }
  return {
    text: "text-muted-foreground",
    border: "border-border",
    fill: "bg-muted-foreground",
    stroke: "text-muted-foreground",
  };
}
