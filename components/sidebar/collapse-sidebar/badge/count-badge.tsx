/* ─────────────────────────────────────────────────────────────────────────
   Inline Badge (Expanded sidebar)
   ───────────────────────────────────────────────────────────────────────── */
export default function CountBadge({ count }: { count: number }) {
  /* -------------------------------- Render UI -------------------------------- */
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold leading-none text-destructive-foreground ring-[2px] ring-destructive/20">
      {count > 99 ? "99+" : count}
    </span>
  );
}
