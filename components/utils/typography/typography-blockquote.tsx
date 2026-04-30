import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const TypographyBlockquote = forwardRef<
  HTMLQuoteElement,
  ComponentPropsWithoutRef<"blockquote">
>(({ className, children, ...props }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
});

TypographyBlockquote.displayName = "TypographyBlockquote";

// Alias for backwards compatibility if needed, but we should fix the typo where used
export const TypographyBlackqoute = TypographyBlockquote;
