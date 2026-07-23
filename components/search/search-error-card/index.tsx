import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideAlertTriangle } from "lucide-react";
import { ISearchErrorCardProps } from "./props";

export function SearchErrorCard({ title, description }: ISearchErrorCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex w-full items-start gap-4 rounded-none border border-destructive/25 border-l-[5px] border-l-destructive bg-destructive/5 px-4 py-5 text-destructive shadow-[5px_5px_0_hsl(var(--destructive)/0.07)] sm:px-5">
      {/* Icon Section */}
      <div className="grid size-9 shrink-0 place-items-center border border-destructive/25 bg-background">
        <LucideAlertTriangle className="size-4" />
      </div>

      {/* Content Section */}
      <div className="min-w-0 text-left">
        <TypographyH4 className="text-destructive">{title}</TypographyH4>
        <TypographyP className="text-sm mt-1">{description}</TypographyP>
      </div>
    </div>
  );
}
