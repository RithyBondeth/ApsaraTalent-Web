import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyLarge(props: ITypographyProps) {
  return (
    <div
      className={cn("text-lg font-semibold", props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
