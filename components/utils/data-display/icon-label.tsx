import { cn } from "@/lib/utils";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";
import { ReactNode } from "react";
interface ILabelProps {
  text: string;
  icon?: ReactNode;
  className?: string;
}

export default function IconLabel(props: ILabelProps) {
  return (
    <div className={cn("flex items-center gap-2", props.className)}>
      {props.icon && <span className="[&>svg]:!size-5">{props.icon}</span>}
      <TypographyMuted className="text-left">{props.text}</TypographyMuted>
    </div>
  );
}
