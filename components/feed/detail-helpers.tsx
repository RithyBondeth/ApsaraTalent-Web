import React from "react";

export function DetailCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border/60 shadow-sm ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-border/60">
      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="[&>svg]:size-[18px] [&>svg]:text-primary [&>svg]:stroke-[1.5]">
          {icon}
        </span>
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
    </div>
  );
}

export function MetaChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full [&>svg]:size-3.5 [&>svg]:shrink-0">
      {icon}
      {label}
    </span>
  );
}
