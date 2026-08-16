import { LucideLightbulb } from "lucide-react";
import { IQuestionCardProps } from "./props";
import {
  INTERVIEW_PREP_CHIP,
  INTERVIEW_PREP_CHIP_FALLBACK,
} from "@/utils/constants/matching.constant";

export function QuestionCard(props: IQuestionCardProps) {
  /* ---------------------------- Props --------------------------- */
  const { item, index, tipLabel } = props;

  /* -------------------------- All States ------------------------ */
  const interviewPrepChip =
    INTERVIEW_PREP_CHIP[item.category] ?? INTERVIEW_PREP_CHIP_FALLBACK;

  /* -------------------------- Render UI ------------------------- */
  return (
    <div className="flex flex-col gap-3 overflow-hidden border border-border bg-card px-4 py-4 duration-300 animate-in fade-in-0 slide-in-from-bottom-2">
      {/* Question Section */}
      <div className="flex gap-3">
        <span className="mt-0.5 w-5 shrink-0 text-right text-xs font-medium leading-5 text-muted-foreground/50">
          {index + 1}
        </span>
        <div className="flex-1">
          <span
            className={`border-current/15 mb-2 inline-flex border px-2.5 py-0.5 text-[11px] font-medium ${interviewPrepChip}`}
          >
            {item.category}
          </span>
          <p className="text-sm font-medium leading-relaxed text-foreground">
            {item.question}
          </p>
          {item.questionKm && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {item.questionKm}
            </p>
          )}
        </div>
      </div>

      {/* Tip Section */}
      <div className="ml-8 border border-warning-border border-l-warning bg-warning-subtle px-4 py-3">
        <div className="flex gap-2.5">
          {/* Icon Section */}
          <LucideLightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
          {/* Content Section */}
          <div>
            <p className="pixel-label mb-1.5 text-warning-accent">{tipLabel}</p>
            <p className="text-sm leading-relaxed text-foreground/80">
              {item.tip}
            </p>
            {item.tipKm && (
              <p className="mt-2 border-t border-warning-border pt-2 text-xs leading-relaxed text-muted-foreground">
                {item.tipKm}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
