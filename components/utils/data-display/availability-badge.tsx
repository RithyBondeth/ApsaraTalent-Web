import { formatAvailabilityWords } from "@/utils/functions/text";

/* ---------------------------------------------------------------------------
 * Availability is a category, not a state — a freelancer is not "warning" —
 * so this reads from the categorical ramp rather than the status one. Each
 * entry is a literal class string because Tailwind only compiles class names
 * it can see spelled out.
 * ------------------------------------------------------------------------- */

const VARIANTS = {
  full: {
    surface: "bg-category-teal-subtle text-category-teal-accent",
    dot: "bg-category-teal",
  },
  part: {
    surface: "bg-category-indigo-subtle text-category-indigo-accent",
    dot: "bg-category-indigo",
  },
  free: {
    surface: "bg-category-violet-subtle text-category-violet-accent",
    dot: "bg-category-violet",
  },
  other: {
    surface: "bg-muted text-muted-foreground",
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

export function AvailabilityBadge({ availability }: { availability: string }) {
  /* ---------------------------------- Utils --------------------------------- */
  const config = resolveVariant(availability);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={`border-current/15 inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium ${config.surface}`}
    >
      {/* Availability Dot Section */}
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dot}`} />

      {/* Availability Label Section */}
      {formatAvailabilityWords(availability)}
    </span>
  );
}
