import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyP(props: ITypographyProps) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
