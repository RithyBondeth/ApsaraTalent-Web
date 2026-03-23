import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyH1(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.className,
      )}
      style={props.style}
    >
      {props.children}
    </h1>
  );
}
