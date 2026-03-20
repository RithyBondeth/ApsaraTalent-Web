import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyH4(props: ITypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight",
        props.className
      )}
      style={props.style}
    >
      {props.children}
    </h4>
  );
}
