import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TypographyMuted = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

TypographyMuted.displayName = "TypographyMuted";
