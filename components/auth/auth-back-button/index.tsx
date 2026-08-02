import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideArrowLeft } from "lucide-react";
import { IAuthBackButtonProps } from "./props";

export function AuthBackButton(props: IAuthBackButtonProps) {
  /* ------------------------------- Props ------------------------------- */
  const {
    children,
    className,
    type = "button",
    variant = "outline",
    ...buttonProps
  } = props;

  /* ----------------------------- Render UI ----------------------------- */
  return (
    <Button
      type={type}
      variant={variant}
      className={cn("auth-back-button gap-2", className)}
      {...buttonProps}
    >
      <LucideArrowLeft className="size-4 shrink-0" />
      {children}
    </Button>
  );
}
