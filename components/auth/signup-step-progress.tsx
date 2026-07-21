import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------- Helpers --------------------------------- */
interface ISignupStepProgressProps {
  currentStep: number;
  labels: string[];
  progressLabel: string;
  skippedLabel: string;
  skippedSteps?: number[];
}

export function SignupStepProgress({
  currentStep,
  labels,
  progressLabel,
  skippedLabel,
  skippedSteps = [],
}: ISignupStepProgressProps) {
  /* --------------------------------- Utils --------------------------------- */
  const progress =
    labels.length > 1 ? ((currentStep - 1) / (labels.length - 1)) * 100 : 100;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <section className="auth-stepper" aria-label={progressLabel}>
      {/* Auth Stepper Summary Section */}
      <div className="auth-stepper-summary">
        <span>{progressLabel}</span>
        <strong>{labels[currentStep - 1]}</strong>
      </div>

      {/* Auth Stepper Track Section */}
      <div className="auth-stepper-track" aria-hidden="true">
        {/* Auth Stepper Rail Section */}
        <span className="auth-stepper-rail" />

        {/* Auth Stepper Fill Section */}
        <span
          className="auth-stepper-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />

        {/* Auth Stepper Steps Section */}
        <ol>
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isSkipped = skippedSteps.includes(stepNumber);
            const isCurrent = currentStep === stepNumber;
            const isComplete = currentStep > stepNumber && !isSkipped;

            return (
              <li
                key={label}
                className={cn(
                  isCurrent && "is-current",
                  isComplete && "is-complete",
                  isSkipped && "is-skipped",
                )}
                title={isSkipped ? `${label} — ${skippedLabel}` : label}
              >
                <span>
                  {isComplete ? (
                    <Check aria-hidden="true" />
                  ) : isSkipped ? (
                    <Minus aria-hidden="true" />
                  ) : (
                    stepNumber
                  )}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
