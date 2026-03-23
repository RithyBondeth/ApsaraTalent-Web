import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH3(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </h3>
  );
}
