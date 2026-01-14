import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyMuted(props: ITypographyProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
