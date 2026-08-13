import { Button } from "@/components/ui/button";
import { ILazyActionButtonProps } from "./props";
import {
  LucideFileText,
  LucideLoader2,
  LucideMessageCircleQuestion,
  LucideSparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { IAiMatchExplanationModalProps } from "../ai-match-explanation-modal/props";
import { lazy, Suspense, useState } from "react";
import { IAiCoverLetterModalProps } from "../ai-cover-letter-modal/props";
import { IAiSkillGapModalProps } from "../ai-skill-gap-modal/props";
import { IAiInterviewPrepModalProps } from "../ai-interview-prep-modal/props";

/* ---------------------------------------------- Helpers ------------------------------------------ */
const AiMatchExplanationModal = lazy(() =>
  import("@/components/matching/ai-match-explanation-modal").then((module) => ({
    default: module.AiMatchExplanationModal,
  })),
);
const AiCoverLetterModal = lazy(() =>
  import("@/components/matching/ai-cover-letter-modal").then((module) => ({
    default: module.AiCoverLetterModal,
  })),
);
const AiSkillGapModal = lazy(() =>
  import("@/components/matching/ai-skill-gap-modal").then((module) => ({
    default: module.AiSkillGapModal,
  })),
);
const AiInterviewPrepModal = lazy(() =>
  import("@/components/matching/ai-interview-prep-modal").then((module) => ({
    default: module.AiInterviewPrepModal,
  })),
);

/* ------------------------------------ Lazy Action Button Component ------------------------------- */
export function LazyActionButton(props: ILazyActionButtonProps) {
  /* ----------------------------- Props ----------------------------- */
  const { label, compact, icon, interview, onClick } = props;

  /* --------------------------- Render UI --------------------------- */
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

/* ---------------------------------- Loading Action Button Component ----------------------------- */
export function LoadingActionButton(
  props: Pick<ILazyActionButtonProps, "label" | "compact" | "interview">,
) {
  /* ----------------------------- Props ----------------------------- */
  const { label, compact, interview } = props;

  /* --------------------------- Render UI --------------------------- */
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
      <LucideLoader2 className="size-3.5 shrink-0 animate-spin text-primary" />
      <span className={compact ? "hidden sm:inline" : undefined}>{label}</span>
    </Button>
  );
}

/* ---------------------------- Lazy Ai Match Explaination Action Component ----------------------- */
export function LazyAiMatchExplanationAction(
  props: IAiMatchExplanationModalProps,
) {
  /* ----------------------------- Utils ----------------------------- */
  const t = useTranslations("matching");

  /* --------------------------- All States -------------------------- */
  const [loaded, setLoaded] = useState<boolean>(false);

  /* --------------------------- Render UI --------------------------- */
  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton label={t("aiScore")} compact={props.compact} />
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
      icon={<LucideSparkles className="size-3.5 shrink-0 text-primary" />}
      onClick={() => setLoaded(true)}
    />
  );
}

/* -------------------------------- Lazy Ai CoverLetter Action Component -------------------------- */
export function LazyAiCoverLetterAction(props: IAiCoverLetterModalProps) {
  /* ----------------------------- Utils ----------------------------- */
  const t = useTranslations("matching");

  /* --------------------------- All States -------------------------- */
  const [loaded, setLoaded] = useState<boolean>(false);

  /* --------------------------- Render UI --------------------------- */
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
      icon={<LucideFileText className="size-3.5 shrink-0 text-primary" />}
      onClick={() => setLoaded(true)}
    />
  );
}

/* ------------------------------- Lazy Ai Skill Gap Action Component -------------------------- */
export function LazyAiSkillGapAction(props: IAiSkillGapModalProps) {
  /* ----------------------------- Utils ----------------------------- */
  const t = useTranslations("matching");

  /* --------------------------- All States -------------------------- */
  const [loaded, setLoaded] = useState<boolean>(false);

  /* --------------------------- Render UI --------------------------- */
  if (loaded) {
    return (
      <Suspense
        fallback={
          <LoadingActionButton label={t("skillGap")} compact={props.compact} />
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
      icon={<LucideSparkles className="size-3.5 shrink-0 text-primary" />}
      onClick={() => setLoaded(true)}
    />
  );
}

/* -------------------------------- Lazy Ai Interview Prep Component --------------------------- */
export function LazyAiInterviewPrepAction(props: IAiInterviewPrepModalProps) {
  /* ----------------------------- Utils ----------------------------- */
  const t = useTranslations("matching");

  /* --------------------------- All States -------------------------- */
  const [loaded, setLoaded] = useState<boolean>(false);

  /* --------------------------- Render UI --------------------------- */
  if (loaded) {
    return (
      <Suspense
        fallback={<LoadingActionButton label={t("interviewPrep")} interview />}
      >
        <AiInterviewPrepModal {...props} autoOpen />
      </Suspense>
    );
  }

  return (
    <LazyActionButton
      label={t("interviewPrep")}
      icon={<LucideMessageCircleQuestion className="size-3.5 text-primary" />}
      interview
      onClick={() => setLoaded(true)}
    />
  );
}
