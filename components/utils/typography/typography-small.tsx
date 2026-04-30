import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TypographySmall = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<"small">
>(({ className, children, ...props }, ref) => {
  return (
    <small
      ref={ref}
      className={cn("text-sm transition-all", className)}
      {...props}
    >
      {children}
    </small>
  );
});

TypographySmall.displayName = "TypographySmall";
