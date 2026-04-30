import { cn } from "@/lib/utils";

/* ----------------------------------- Helper ---------------------------------- */
interface IMetaChipProps {
  icon: React.ReactNode;
  text: string;
  className?: string;
}

export default function MetaChip(props: IMetaChipProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { icon, text, className } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/70 px-3 py-1.5 rounded-full",
        className,
      )}
    >
      {/* Icon Section */}
      <span className="[&>svg]:size-3.5 flex-shrink-0">{icon}</span>

      {/* Text Section */}
      <span className="truncate">{text}</span>
    </span>
  );
}
