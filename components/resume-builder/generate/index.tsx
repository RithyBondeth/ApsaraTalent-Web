import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideRocket } from "lucide-react";
import { IResumeBuilderGenerateProps } from "./props";

/* -------------------------------- Component ------------------------------- */
export default function ResumeBuilderGenerate({
  onGenerateClick,
  disabled,
}: IResumeBuilderGenerateProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full bg-primary text-secondary flex flex-col items-center justify-center rounded-md gap-3 p-5">
      {/* Title Section */}
      <TypographyH4>Ready to create your perfect Resume?</TypographyH4>

      {/* Description Section */}
      <TypographyMuted>
        Join thousands of professionals who landed their dream jobs with our
        AI-powered resumes
      </TypographyMuted>

      {/* Button Section */}
      <Button
        variant={"secondary"}
        onClick={onGenerateClick}
        disabled={disabled}
      >
        <LucideRocket />
        Generate my resume
      </Button>

      {/* Disabled Section */}
      {disabled && (
        <TypographyMuted className="text-xs">
          Please select a template to continue.
        </TypographyMuted>
      )}
    </div>
  );
}
