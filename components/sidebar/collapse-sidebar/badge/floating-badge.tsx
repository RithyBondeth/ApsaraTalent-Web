/* ─────────────────────────────────────────────────────────────────────────
   Floating Badge (Collapsed sidebar) — with ping animation for attention
   ───────────────────────────────────────────────────────────────────────── */
export default function FloatingBadge({ count }: { count: number }) {
  /* -------------------------------- Render UI -------------------------------- */
  if (count === 0) return null;
  return (
    <span className="pointer-events-none absolute -top-1.5 right-0.5 z-50">
      {/* Ping ring */}
      <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-60" />
      {/* Solid badge */}
      <span className="relative flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
        {count > 99 ? "99+" : count}
      </span>
    </span>
  );
}
