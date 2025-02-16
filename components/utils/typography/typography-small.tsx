import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographySmall(props: ITypographyProps) {
    return (
      <small className={cn("text-sm leading-none", props.className)} style={props.style}>
        {props.children} 
      </small>
    )
  }