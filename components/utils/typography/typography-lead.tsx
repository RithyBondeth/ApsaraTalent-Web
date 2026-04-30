import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TypographyLead = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xl text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
});

TypographyLead.displayName = "TypographyLead";
