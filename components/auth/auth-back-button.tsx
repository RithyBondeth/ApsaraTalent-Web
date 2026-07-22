import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideArrowLeft } from "lucide-react";
import * as React from "react";

export function AuthBackButton(props : React.ComponentProps<typeof Button>) {
  /* ------------------------------- Props ------------------------------- */
  const { children, className, type = "button", variant = "outline" } = props;
  /* ----------------------------- Render UI ----------------------------- */
  return (
    <Button
      type={type}
      variant={variant}
      className={cn("auth-back-button gap-2", className)}
      {...props}
    >
      <LucideArrowLeft className="size-4 shrink-0" />
      {children}
    </Button>
  );
}
