import { cn } from "@/lib/utils";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/* ----------------------------------- Helper ---------------------------------- */
interface ILabelInput {
  label: string;
  input: React.ReactNode;
  className?: string;
}

export default function LabelInput(props: ILabelInput) {
  /* --------------------------------- Props --------------------------------- */
  const { label, input, className } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className={cn("w-full flex flex-col items-start gap-2", className)}>
      <TypographyMuted className="text-xs">{label}</TypographyMuted>
      {input}
    </div>
  );
}
