import { TypographyMuted } from "@/components/utils/typography/typography-muted";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <TypographyMuted className="text-xs font-medium mb-1">
      {children}
    </TypographyMuted>
  );
}
