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

const STORAGE_KEY = "onboarding-complete-v1";

interface Step {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  accent: string;
}

const STEPS: Step[] = [
  {
    icon: <LucideSparkles className="size-7" />,
    titleKey: "step1Title",
    descKey: "step1Desc",
    accent: "from-violet-500/20 to-primary/10",
  },
  {
    icon: <LucideHeartHandshake className="size-7" />,
    titleKey: "step2Title",
    descKey: "step2Desc",
    accent: "from-rose-500/20 to-rose-400/5",
  },
  {
    icon: <LucideBookmark className="size-7" />,
    titleKey: "step3Title",
    descKey: "step3Desc",
    accent: "from-amber-500/20 to-amber-400/5",
  },
  {
    icon: <LucideTrophy className="size-7" />,
    titleKey: "step4Title",
    descKey: "step4Desc",
    accent: "from-emerald-500/20 to-emerald-400/5",
  },
];

export function OnboardingFlow() {
  const t = useTranslations("onboarding");
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
        // Short delay so the page renders first
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage blocked — skip onboarding
    }
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 250);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-foreground/30 backdrop-blur-[2px] transition-opacity duration-300",
          closing ? "opacity-0" : "opacity-100",
        )}
        onClick={dismiss}
      />

      {/* Coach card */}
      <div
        className={cn(
          "fixed bottom-24 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 transition-all duration-300 lg:bottom-10",
          closing ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-[0_20px_60px_hsl(var(--foreground)/0.18)]">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LucideX className="size-3.5" />
          </button>

          {/* Icon + text */}
          <div className={cn("flex items-start gap-4")}>
            <div
              className={cn(
                "flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-foreground",
                current.accent,
              )}
            >
              {current.icon}
            </div>
            <div className="flex flex-col gap-1 pr-4">
              <p className="font-semibold text-sm leading-snug">
                {t(current.titleKey)}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(current.descKey)}
              </p>
            </div>
          </div>

          {/* Footer: dots + button */}
          <div className="flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    i === step
                      ? "w-5 h-2 bg-foreground"
                      : "w-2 h-2 bg-border hover:bg-muted-foreground/50",
                  )}
                />
              ))}
            </div>

            <Button
              size="sm"
              onClick={next}
              className="h-8 px-4 rounded-full text-xs gap-1.5"
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
