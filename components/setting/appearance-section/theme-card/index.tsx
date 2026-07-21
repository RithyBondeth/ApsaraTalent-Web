import { cn } from "@/lib/utils";
import { IThemeCardProps } from "./props";
import { LucideCheck } from "lucide-react";

export function ThemeCard(props: IThemeCardProps) {
  /* ---------------------------------- Props ---------------------------------- */
  const { value, label, icon, active, onClick } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-left transition-colors duration-200",
        active
          ? "border-brand/35 bg-brand-soft/70 shadow-[0_0_0_1px_hsl(var(--brand)/0.08)]"
          : "border-border/70 bg-background/50 hover:border-brand/20 hover:bg-muted/35",
      )}
    >
      {/* Mini Window Preview Section */}
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

      {/* Label Section */}
      <div className="flex items-center gap-1.5 justify-center">
        <span
          className={cn(
            "[&>svg]:size-3.5",
            active ? "text-brand" : "text-muted-foreground",
          )}
        >
          {icon}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            active ? "text-brand" : "text-muted-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {/* Active Checkmark Section */}
      {active && (
        <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-brand">
          <LucideCheck
            className="size-2.5 text-brand-foreground"
            strokeWidth={3}
          />
        </span>
      )}
    </button>
  );
}
