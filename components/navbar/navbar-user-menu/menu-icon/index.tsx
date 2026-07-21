import { IMenuIconProps } from "./props";

export default function MenuIcon(props: IMenuIconProps) {
  /* --------------------------------- Props --------------------------------- */
  const { children, className } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/10 bg-brand-soft text-brand [&>svg]:size-3.5 ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
