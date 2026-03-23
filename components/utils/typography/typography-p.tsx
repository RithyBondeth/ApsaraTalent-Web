import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyP(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
