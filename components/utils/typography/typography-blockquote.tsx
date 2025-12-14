import { cn } from "@/lib/utils";
import { ITypographyProps } from "@/utils/interfaces/typography.interface";

export function TypographyBlackqoute(props: ITypographyProps) {
  return (
    <p
      className={cn("mt-6 border-l-2 pl-6 italic", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
