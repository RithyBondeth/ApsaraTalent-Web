import { IBadgePillProps } from "./props";

export default function BadgePill(props: IBadgePillProps) {
  /* --------------------------------- Props --------------------------------- */
  const { count } = props;

  /* ------------------------------ Empty State ------------------------------ */
  if (count <= 0) return null;

  /* ------------------------------- Render UI ------------------------------- */
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 animate-nav-badge-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
