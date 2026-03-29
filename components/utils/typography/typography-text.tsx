import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef } from "react";

export function TypographyText({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn(className)} {...props}>
      {children}
    </p>
  );
}
