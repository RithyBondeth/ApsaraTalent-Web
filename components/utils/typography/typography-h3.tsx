import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyH3(props: ITypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className
      )}
      style={props.style}
    >
      {props.children}
    </h3>
  );
}
