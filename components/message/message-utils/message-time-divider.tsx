import { getDateDividerLabel } from "@/utils/functions/date";

export default function MessageTimeDivider({
  timestamp,
}: {
  timestamp: Date | string;
}) {
  /* ---------------------------------- Utils --------------------------------- */
  const label = getDateDividerLabel(timestamp);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div className="flex items-center gap-4 my-8">
      {/* Time Divider Line Section */}
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
      {/* Time Divider Label Section */}
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {label}
      </div>
      {/* Time Divider Line Section */}
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
    </div>
  );
}
