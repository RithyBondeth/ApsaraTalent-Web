import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function TypographyBlackqoute(props: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={cn("mt-6 border-l-2 pl-6 italic", props.className)}
      style={props.style}
    >
      {props.children}
    </p>
  );
}
