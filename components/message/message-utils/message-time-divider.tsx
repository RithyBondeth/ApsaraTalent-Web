export const MessageTimeDivider = ({
  timestamp,
}: {
  timestamp: Date | string;
}) => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  let label = "";
  if (isToday) {
    label = "Today";
  } else if (isYesterday) {
    label = "Yesterday";
  } else {
    label = date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }

  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
        {label}
      </div>
      <div className="flex-1 h-[1px] bg-muted-foreground/10" />
    </div>
  );
};
