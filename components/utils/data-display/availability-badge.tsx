export function AvailabilityBadge({ availability }: { availability: string }) {
  /* ---------------------------------- Utils --------------------------------- */
  const lower = availability.toLowerCase();
  const config = lower.includes("full")
    ? {
        color:
          "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300",
        dot: "bg-green-500",
      }
    : lower.includes("part")
      ? {
          color:
            "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
          dot: "bg-blue-500",
        }
      : lower.includes("free")
        ? {
            color:
              "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
            dot: "bg-purple-500",
          }
        : {
            color: "bg-muted text-muted-foreground",
            dot: "bg-muted-foreground",
          };

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${config.color}`}
    >
      {/* Availability Dot Section */}
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${config.dot}`} />

      {/* Availability Label Section */}
      {availability}
    </span>
  );
}
