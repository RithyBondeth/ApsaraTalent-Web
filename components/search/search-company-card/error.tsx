import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideAlertTriangle } from "lucide-react";

export function SearchEmployeeCardError({ error, errorDescription }: { error: string, errorDescription: string }) {
  return (
    <div className="w-full flex flex-col items-center gap-4 px-4 py-6 shadow-md rounded-md border border-destructive/20 bg-destructive/5 text-destructive">
      <LucideAlertTriangle className="size-8" />
      <div className="text-center">
        <TypographyH4 className="text-destructive">{error}</TypographyH4>
        <TypographyP className="text-sm mt-1">{errorDescription}</TypographyP>
      </div>
    </div>
  );
}
