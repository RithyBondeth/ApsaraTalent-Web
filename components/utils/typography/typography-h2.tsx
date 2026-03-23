import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH2(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h2
      className={cn(
        "scroll-m-20 pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0",
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </h2>
  );
}
