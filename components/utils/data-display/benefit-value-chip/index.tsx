import { cn } from "@/lib/utils";
import { LucideCircleCheck, LucideX } from "lucide-react";
import type { IBenefitValueChipProps, TBenefitValueKind } from "./props";

/* ---------------------------------------------------------------------------
 * One chip for a company benefit or value, everywhere they are rendered.
 *
 * There were four separate implementations and they had drifted into two
 * different visual languages: the authoring surfaces (profile, signup wizard)
 * drew a neutral `bg-muted` chip with the label coloured by a raw hex
 * (`#0073E6` / `#69B41E`, which never adapted to dark mode at all), while the
 * reading surfaces (employee-facing company page, company dialog) drew a tinted
 * chip out of raw palette classes with hand-written `dark:` twins. Same data,
 * four answers.
 *
 * Benefits and values differ in KIND, not severity, so they take categorical
 * tokens rather than status ones. Benefits started on indigo, the closest hue
 * to the blue the app had been hand-rolling, but indigo is what
 * AvailabilityBadge gives part-time, and the feed interleaves company and
 * employee cards in one grid. Magenta sits 133° from the lime that values use —
 * the separation that matters most, since benefit and value chips are adjacent
 * in the same row — and well clear of every availability hue. As with
 * StatusPill, the classes are written out in full: Tailwind only compiles class
 * names it can see as literal strings, so `bg-category-${kind}-subtle` would
 * silently compile to nothing.
 * ------------------------------------------------------------------------- */

const KIND: Record<TBenefitValueKind, string> = {
  benefit:
    "border-category-magenta-accent/20 bg-category-magenta-subtle text-category-magenta-accent",
  value:
    "border-category-lime-accent/20 bg-category-lime-subtle text-category-lime-accent",
};

export function BenefitValueChip({
  kind,
  label,
  onRemove,
  removeLabel,
  className,
}: IBenefitValueChipProps) {
  /* -------------------------------- Render UI ------------------------------- */
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 border px-2.5 py-1.5 text-xs font-medium",
        KIND[kind],
        className,
      )}
    >
      {/* Icon Section */}
      <LucideCircleCheck aria-hidden className="size-3.5 shrink-0" />

      {/* Label Section */}
      <span className="min-w-0 break-words">{label}</span>

      {/* Remove Section */}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={removeLabel ?? label}
          className="-mr-0.5 shrink-0 text-destructive transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LucideX className="size-3.5" />
        </button>
      ) : null}
    </span>
  );
}
