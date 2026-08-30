import { IBadgePillProps } from "./props";

export default function BadgePill(props: IBadgePillProps) {
  /* --------------------------------- Props --------------------------------- */
  const { count } = props;

  /* ------------------------------ Empty State ------------------------------ */
  if (count <= 0) return null;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <span className="absolute -right-2 -top-2 flex h-[17px] min-w-[17px] items-center justify-center border border-background bg-destructive px-1 text-[9px] font-extrabold leading-none text-destructive-foreground shadow-hard-xs">
      {count > 99 ? "99+" : count}
    </span>
  );
}
