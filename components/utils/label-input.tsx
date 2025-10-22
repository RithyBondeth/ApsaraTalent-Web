import { TypographyMuted } from "./typography/typography-muted";

export default function LabelInput({
  label,
  input,
  className,
}: {
  label: string;
  input: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full flex flex-col items-start gap-2 ${className}`}>
      <TypographyMuted className="text-xs">{label}</TypographyMuted>
      {input}
    </div>
  );
}
