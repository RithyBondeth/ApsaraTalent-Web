import { IMenuIconProps } from "./props";

export default function MenuIcon(props: IMenuIconProps) {
  /* --------------------------------- Props --------------------------------- */
  const { children, className } = props;

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <span
      className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${className}`}
    >
      {children}
    </span>
  );
}
