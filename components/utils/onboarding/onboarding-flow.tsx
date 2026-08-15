"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LucideX,
  LucideArrowRight,
  LucideSparkles,
  LucideHeartHandshake,
  LucideBookmark,
  LucideTrophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_SHOW_DELAY_MS,
} from "@/utils/constants/config.constant";

/* --------------------------------- Helpers -------------------------------- */
const STEPS: {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  accent: string;
}[] = [
  {
    icon: <LucideSparkles className="size-7" />,
    titleKey: "step1Title",
    descKey: "step1Desc",
    accent: "from-category-violet/20 to-primary/10",
  },
  {
    icon: <LucideHeartHandshake className="size-7" />,
    titleKey: "step2Title",
    descKey: "step2Desc",
    accent: "from-category-magenta/20 to-category-magenta/5",
  },
  {
    icon: <LucideBookmark className="size-7" />,
    titleKey: "step3Title",
    descKey: "step3Desc",
    accent: "from-category-orange/20 to-category-orange/5",
  },
  {
    icon: <LucideTrophy className="size-7" />,
    titleKey: "step4Title",
    descKey: "step4Desc",
    accent: "from-category-teal/20 to-category-teal/5",
  },
] as const;

export function OnboardingFlow() {
  /* --------------------------------- Utils ---------------------------------- */
  const t = useTranslations("onboarding");

  /* ------------------------------- All States ------------------------------- */
  const [step, setStep] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const currentStep = STEPS[step];

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        !localStorage.getItem(ONBOARDING_STORAGE_KEY)
      ) {
        const timer = setTimeout(
          () => setVisible(true),
          ONBOARDING_SHOW_DELAY_MS,
        );
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  /* --------------------------------- Methods -------------------------------- */
  // ── Handle Dismiss ───────────────────────
  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
      } catch {}
    }, 250);
  };

  // ── Handle Next ────────────────────────
  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  /* -------------------------------- Null State -------------------------------- */
  if (!visible) return null;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <>
      {/* Backdrop Section */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-300",
          closing ? "opacity-0" : "opacity-100",
        )}
        onClick={dismiss}
      />

      {/* Coach Card Section */}
      <div
        className={cn(
          "fixed bottom-24 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 transition-all duration-300 lg:bottom-10",
          closing ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card Container Section */}
        <div className="relative flex flex-col gap-4 rounded-none border border-t-[5px] border-border border-t-foreground bg-card p-5 shadow-[6px_6px_0_hsl(var(--foreground)/0.12)]">
          {/* Close Button Section */}
          <button
            onClick={dismiss}
            aria-label="Close onboarding"
            className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LucideX className="size-3.5" />
          </button>

          {/* Icon Text Profile Section */}
          <div className={cn("flex items-start gap-4")}>
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-none border border-border bg-gradient-to-br text-foreground",
                currentStep.accent,
              )}
            >
              {currentStep.icon}
            </div>
            <div className="flex flex-col gap-1 pr-4">
              <p className="text-sm font-semibold leading-snug">
                {t(currentStep.titleKey)}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {t(currentStep.descKey)}
              </p>
            </div>
          </div>

          {/* Footer Controller Section */}
          <div className="flex items-center justify-between">
            {/* Progress Dots Section */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  aria-label={`Go to onboarding step ${i + 1}`}
                  aria-current={i === step ? "step" : undefined}
                  className={cn(
                    "rounded-none transition-all duration-200",
                    i === step
                      ? "h-2 w-5 bg-foreground"
                      : "h-2 w-2 bg-border hover:bg-muted-foreground/50",
                  )}
                />
              ))}
            </div>

            {/* Next Action Button Section */}
            <Button
              size="sm"
              onClick={next}
              className="h-8 gap-1.5 rounded-none px-4 text-xs"
            >
              {step < STEPS.length - 1 ? (
                <>
                  {t("next")}
                  <LucideArrowRight className="size-3" />
                </>
              ) : (
                t("getStarted")
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
