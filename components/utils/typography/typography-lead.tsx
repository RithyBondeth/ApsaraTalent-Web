import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyLead(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={cn("text-xl text-muted-foreground", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
