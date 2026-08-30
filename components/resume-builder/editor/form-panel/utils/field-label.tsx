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
    <TypographyMuted className={`mb-1 text-xs font-medium ${className ?? ""}`}>
      {children}
    </TypographyMuted>
  );
}
