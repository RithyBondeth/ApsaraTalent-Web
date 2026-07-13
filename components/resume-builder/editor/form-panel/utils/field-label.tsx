import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <TypographyMuted className={`text-xs font-medium mb-1 ${className ?? ""}`}>
      {children}
    </TypographyMuted>
  );
}
