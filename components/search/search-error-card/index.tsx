import { TypographyH4 } from "@/components/utils/typography/typography-h4";
import { TypographyP } from "@/components/utils/typography/typography-p";
import { LucideAlertTriangle } from "lucide-react";
import { ISearchErrorCardProps } from "./props";

export function SearchErrorCard({ title, description }: ISearchErrorCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="w-full flex flex-col items-center gap-4 px-4 py-6 shadow-md rounded-md border border-destructive/20 bg-destructive/5 text-destructive">
      {/* Icon Section */}
      <LucideAlertTriangle className="size-8" />
      {/* Content Section */}
      <div className="text-center">
        <TypographyH4 className="text-destructive">{title}</TypographyH4>
        <TypographyP className="text-sm mt-1">{description}</TypographyP>
      </div>
    </div>
  );
}
