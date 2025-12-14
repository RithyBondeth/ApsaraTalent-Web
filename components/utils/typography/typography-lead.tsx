import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyLead(props: ITypographyProps) {
  return (
    <p
      className={cn("text-xl text-muted-foreground", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
