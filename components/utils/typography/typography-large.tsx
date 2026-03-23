import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyLarge(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("text-lg font-semibold", props.className)}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
