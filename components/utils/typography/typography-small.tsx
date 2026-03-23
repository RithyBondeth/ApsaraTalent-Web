import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographySmall(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <small className={cn("text-sm", props.className)} style={props.style}>
      {props.children}
    </small>
  );
}
