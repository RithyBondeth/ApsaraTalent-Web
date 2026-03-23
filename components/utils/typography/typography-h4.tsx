import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH4(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight",
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </h4>
  );
}
