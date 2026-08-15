import React from "react";
import { cn } from "@/lib/utils";

/* ----------------------------------- Helper ---------------------------------- */
interface IDetailCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DetailCard({ children, className }: IDetailCardProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className={cn("border border-border bg-card", className)}>
      {children}
    </div>
  );
}
