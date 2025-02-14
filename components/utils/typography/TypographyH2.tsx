import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyH2(props: ITypographyProps) {
    return (
      <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", props.className)} style={props.style}>
        {props.children} 
      </h2>
    )
  }