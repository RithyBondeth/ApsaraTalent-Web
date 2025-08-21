import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { LucideRocket } from "lucide-react";

export default function ResumeBuilderGenerate(props: { onGenerateClick: () => void; disabled?: boolean }) {
  return (
    <div className="w-full bg-primary text-secondary flex flex-col items-center justify-center rounded-md gap-3 p-5">
      <TypographyH4>Ready to create your perfect Resume?</TypographyH4>
      <TypographyMuted>
        Join thousands of professionals who landed their dream jobs with our
        AI-powered resumes
      </TypographyMuted>
      <Button variant={"secondary"} onClick={props.onGenerateClick} disabled={props.disabled}>
        <LucideRocket />
        Generate my resume
      </Button>
      {props.disabled && (
        <TypographyMuted className="text-xs">
          Please select a template to continue.
        </TypographyMuted>
      )}
    </div>
  );
}
