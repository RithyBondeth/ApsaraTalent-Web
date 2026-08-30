import { formatAvailabilityWords } from "@/utils/functions/text";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
 * The one availability badge — employee card, matching, favourites, search,
 * the employee detail page and the quick-view dialog.
 *
 * Availability is a category, not a state — a freelancer is not "warning" — so
 * this reads from the categorical ramp rather than the status one. Each entry
 * is a literal class string because Tailwind only compiles class names it can
 * see spelled out.
 *
 * This used to have a twin: `getAvailabilityStyleClass` returned the same three
 * hue pairs and four call sites pasted them into a hand-written span, so the
 * same value rendered as an uppercase micro-label on the cards and a dotted
 * sentence-case chip in the dialog. Both spellings also carried
 * `border-current/15`, which is not a real Tailwind utility and compiled to
 * nothing — every one of those badges was falling back to the default neutral
 * border instead of a tinted one. The typography now follows StatusPill, which
 * is what a small state badge looks like everywhere else in the app.
 * ------------------------------------------------------------------------- */

const VARIANTS = {
  full: {
    surface:
      "bg-category-brown-subtle text-category-brown-accent border-category-brown-accent/20",
    dot: "bg-category-brown",
  },
  part: {
    surface:
      "bg-category-orange-subtle text-category-orange-accent border-category-orange-accent/20",
    dot: "bg-category-orange",
  },
  free: {
    surface:
      "bg-category-purple-subtle text-category-purple-accent border-category-purple-accent/20",
    dot: "bg-category-purple",
  },
  other: {
    surface: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
} as const;

function resolveVariant(availability: string) {
  const lower = availability.toLowerCase();
  if (lower.includes("full")) return VARIANTS.full;
  if (lower.includes("part")) return VARIANTS.part;
  if (lower.includes("free")) return VARIANTS.free;
  return VARIANTS.other;
}

export function AvailabilityBadge({
  availability,
  className,
}: {
  availability: string;
  /** Layout only — nowrap, shrink-0. The badge owns its own colour and type. */
  className?: string;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const config = resolveVariant(availability);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        config.surface,
        className,
      )}
    >
      {/* Availability Dot Section */}
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", config.dot)}
      />

      {/* Availability Label Section */}
      {formatAvailabilityWords(availability)}
    </span>
  );
}
