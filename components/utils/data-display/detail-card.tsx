import React from "react";

interface DetailCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailCard({ children, className }: DetailCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
