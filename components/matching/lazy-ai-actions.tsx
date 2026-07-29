"use client";

import { Button } from "@/components/ui/button";
import type { IAiCoverLetterModalProps } from "@/components/matching/ai-cover-letter-modal/props";
import type { IAiInterviewPrepModalProps } from "@/components/matching/ai-interview-prep-modal/props";
import type { IAiMatchExplanationModalProps } from "@/components/matching/ai-match-explanation-modal/props";
import type { IAiSkillGapModalProps } from "@/components/matching/ai-skill-gap-modal/props";
import {
  LucideFileText,
  LucideLoader2,
  LucideMessageCircleQuestion,
  LucideSparkles,
  LucideTarget,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { lazy, ReactNode, Suspense, useState } from "react";

const AiMatchExplanationModal = lazy(() =>
  import("@/components/matching/ai-match-explanation-modal").then(
    (module) => ({ default: module.AiMatchExplanationModal }),
  ),
);
const AiCoverLetterModal = lazy(() =>
  import("@/components/matching/ai-cover-letter-modal").then(
    (module) => ({ default: module.AiCoverLetterModal }),
  ),
);
const AiSkillGapModal = lazy(() =>
  import("@/components/matching/ai-skill-gap-modal").then(
    (module) => ({ default: module.AiSkillGapModal }),
  ),
);
const AiInterviewPrepModal = lazy(() =>
  import("@/components/matching/ai-interview-prep-modal").then(
    (module) => ({ default: module.AiInterviewPrepModal }),
  ),
);

interface ILazyActionButtonProps {
  label: string;
  compact?: boolean;
  icon: ReactNode;
  interview?: boolean;
  onClick: () => void;
}

function LazyActionButton({
  label,
  compact,
  icon,
  interview,
  onClick,
}: ILazyActionButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      className={
        interview
          ? "gap-1.5 rounded-none text-xs"
          : "h-8 gap-1.5 rounded-none px-2.5 text-xs sm:px-3"
      }
      aria-label={label}
      onClick={onClick}
    >
      {icon}
      <span className={compact ? "hidden sm:inline" : undefined}>{label}</span>
    </Button>
  );
}

function LoadingActionButton({
  label,
  compact,
  interview,
}: Pick<ILazyActionButtonProps, "label" | "compact" | "interview">) {
  return (
    <Button
      size="sm"
      variant="outline"
      className={
        interview
          ? "gap-1.5 rounded-none text-xs"
          : "h-8 gap-1.5 rounded-none px-2.5 text-xs sm:px-3"
      }
      aria-label={label}
      disabled
    >
      <LucideLoader2 className="size-3.5 animate-spin text-primary shrink-0" />
      <span className={compact ? "hidden sm:inline" : undefined}>{label}</span>
    </Button>
  );
}

export function LazyAiMatchExplanationAction(
  props: IAiMatchExplanationModalProps,
) {
  const t = useTranslations("matching");
  const [loaded, setLoaded] = useState<boolean>(false);

  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton
            label={t("aiScore")}
            compact={props.compact}
          />
        }
      >
        <AiMatchExplanationModal {...props} autoOpen />
      </Suspense>
    );
  }

  return (
    <LazyActionButton
      label={t("aiScore")}
      compact={props.compact}
      icon={<LucideSparkles className="size-3.5 text-primary shrink-0" />}
      onClick={() => setLoaded(true)}
    />
  );
}

export function LazyAiCoverLetterAction(props: IAiCoverLetterModalProps) {
  const t = useTranslations("matching");
  const [loaded, setLoaded] = useState<boolean>(false);

  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton
            label={t("coverLetter")}
            compact={props.compact}
          />
        }
      >
        <AiCoverLetterModal {...props} autoOpen />
      </Suspense>
    );
  }

  return (
    <LazyActionButton
      label={t("coverLetter")}
      compact={props.compact}
      icon={<LucideFileText className="size-3.5 text-primary shrink-0" />}
      onClick={() => setLoaded(true)}
    />
  );
}

export function LazyAiSkillGapAction(props: IAiSkillGapModalProps) {
  const t = useTranslations("matching");
  const [loaded, setLoaded] = useState<boolean>(false);

  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton
            label={t("skillGap")}
            compact={props.compact}
          />
        }
      >
        <AiSkillGapModal {...props} autoOpen />
      </Suspense>
    );
  }

  return (
    <LazyActionButton
      label={t("skillGap")}
      compact={props.compact}
      icon={<LucideTarget className="size-3.5 text-primary shrink-0" />}
      onClick={() => setLoaded(true)}
    />
  );
}

export function LazyAiInterviewPrepAction(
  props: IAiInterviewPrepModalProps,
) {
  const t = useTranslations("matching");
  const [loaded, setLoaded] = useState<boolean>(false);

  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton label={t("interviewPrep")} interview />
        }
      >
        <AiInterviewPrepModal {...props} autoOpen />
      </Suspense>
    );
  }

  return (
    <LazyActionButton
      label={t("interviewPrep")}
      icon={
        <LucideMessageCircleQuestion className="size-3.5 text-primary" />
      }
      interview
      onClick={() => setLoaded(true)}
    />
  );
}
