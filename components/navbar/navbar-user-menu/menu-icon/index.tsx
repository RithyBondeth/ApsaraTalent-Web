import { IMenuIconProps } from "./props";
import { cn } from "@/lib/utils";

export default function MenuIcon(props: IMenuIconProps) {
  /* --------------------------------- Props --------------------------------- */
  const { children, className } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center border border-border/70 bg-muted/60",
        className,
      )}
    >
      {children}
    </span>
  );
}
