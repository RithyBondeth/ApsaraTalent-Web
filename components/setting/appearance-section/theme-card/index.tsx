import { cn } from "@/lib/utils";
import { IThemeCardProps } from "./props";
import { LucideCheck } from "lucide-react";

export function ThemeCard({
  value,
  label,
  icon,
  active,
  onClick,
}: IThemeCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer w-full text-left",
        active
          ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50",
      )}
    >
      {/* Mini window preview */}
      <div
        className={cn(
          "w-full h-14 rounded-lg overflow-hidden border flex flex-col gap-1 p-1.5",
          value === "dark"
            ? "bg-zinc-900 border-zinc-700"
            : value === "light"
              ? "bg-white border-zinc-200"
              : "bg-gradient-to-br from-white via-zinc-100 to-zinc-800 border-zinc-300",
        )}
      >
        <div
          className={cn(
            "h-1.5 rounded-full w-3/4",
            value === "dark" ? "bg-zinc-600" : "bg-zinc-300",
          )}
        />
        <div
          className={cn(
            "h-1 rounded-full w-1/2",
            value === "dark" ? "bg-zinc-700" : "bg-zinc-200",
          )}
        />
        <div className="flex gap-1 mt-0.5">
          <div
            className={cn(
              "h-3 rounded flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
          <div
            className={cn(
              "h-3 rounded flex-1",
              value === "dark" ? "bg-zinc-800" : "bg-zinc-100",
            )}
          />
        </div>
      </div>

      {/* Label */}
      <div className="flex items-center gap-1.5 justify-center">
        <span
          className={cn(
            "[&>svg]:size-3.5",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {/* Active checkmark */}
      {active && (
        <span className="absolute top-2 right-2 flex items-center justify-center size-4 rounded-full bg-primary">
          <LucideCheck
            className="size-2.5 text-primary-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}
