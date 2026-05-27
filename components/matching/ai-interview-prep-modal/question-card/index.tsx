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
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden px-4 py-4 flex flex-col gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* Question Section */}
      <div className="flex gap-3">
        <span className="shrink-0 text-xs font-semibold text-muted-foreground/50 w-5 text-right leading-5 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1">
          <span
            className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full mb-2 ${interviewPrepChip}`}
          >
            {item.category}
          </span>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {item.question}
          </p>
          {item.questionKm && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {item.questionKm}
            </p>
          )}
        </div>
      </div>

      {/* Tip Section */}
      <div className="ml-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 px-4 py-3">
        <div className="flex gap-2.5">
          {/* Icon Section */}
          <LucideLightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
          {/* Content Section */}
          <div>
            <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">
              {tipLabel}
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {item.tip}
            </p>
            {item.tipKm && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-amber-100 dark:border-amber-800/30">
                {item.tipKm}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
