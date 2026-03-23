import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyMuted(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
