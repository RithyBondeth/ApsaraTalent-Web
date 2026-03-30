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
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
