import { getDateDividerLabel } from "../../../utils/date";

export default function MessageTimeDivider({
  timestamp,
}: {
  timestamp: Date | string;
}) {
  const label = getDateDividerLabel(timestamp);

  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
    </div>
  );
}
