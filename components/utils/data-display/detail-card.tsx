import React from "react";

/* ----------------------------------- Helper ---------------------------------- */
interface IDetailCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailCard({ children, className }: IDetailCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_2px_8px_hsl(var(--foreground)/0.04)] ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
