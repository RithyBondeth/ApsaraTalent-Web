import { cn } from "@/lib/utils";

interface IMetaChipProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

export default function MetaChip({ icon, text, className }: IMetaChipProps) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full",
        className,
      )}
    >
      <span className="[&>svg]:size-3.5 flex-shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}
