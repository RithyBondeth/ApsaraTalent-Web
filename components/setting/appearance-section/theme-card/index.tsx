import { cn } from "@/lib/utils";
import { IThemeCardProps } from "./props";
import { LucideCheck } from "lucide-react";

export function ThemeCard(props: IThemeCardProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { value, label, icon, active, onClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center gap-2 border-2 p-3 text-left transition-all duration-200",
        active
          ? "border-primary bg-primary/5 shadow-hard-primary"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {/* Mini Window Preview Section */}
      <div
        className={cn(
          "flex h-14 w-full flex-col gap-1 overflow-hidden border p-1.5",
          value === "dark"
            ? "border-zinc-700 bg-zinc-900"
            : value === "light"
              ? "border-zinc-200 bg-white"
              : "border-zinc-300 bg-gradient-to-br from-white via-zinc-100 to-zinc-800",
        )}
      >
        <div
          className={cn(
            "h-1.5 w-3/4",
            value === "dark" ? "bg-zinc-600" : "bg-zinc-300",
          )}
        />
        <div
          className={cn(
            "h-1 w-1/2",
            value === "dark" ? "bg-zinc-700" : "bg-zinc-200",
          )}
        />
        <div className="mt-0.5 flex gap-1">
          <div
            className={cn(
              "h-3 flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
          <div
            className={cn(
              "h-3 flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
        </div>
      </div>

      {/* Label Section */}
      <div className="flex items-center justify-center gap-1.5">
        <span
          className={cn(
            "[&>svg]:size-3.5",
            active ? "text-accent-foreground" : "text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            active ? "text-accent-foreground" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {/* Active Checkmark Section */}
      {active && (
        <span className="absolute right-2 top-2 flex size-4 items-center justify-center bg-primary">
          <LucideCheck
            className="size-2.5 text-primary-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}
