import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TypographyP = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => {
  return (
    <p ref={ref} className={cn("leading-7", className)} {...props}>
      {children}
    </p>
  );
});

TypographyP.displayName = "TypographyP";
