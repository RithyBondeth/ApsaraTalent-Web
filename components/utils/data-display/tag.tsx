import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/* ----------------------------------- Helper ---------------------------------- */
interface ITagInterface {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Tag(props: ITagInterface) {
  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`flex w-fit items-center border border-border/70 bg-muted/65 ${
        props.icon ? "gap-1 py-1.5" : "py-1.5"
      } rounded-lg px-2.5 ${props.className ?? ""}`}
    >
      {/* Icon Section */}
      {props.icon && (
        <span className="text-primary [&>svg]:!size-3.5">{props.icon}</span>
      )}

      {/* Label Section */}
      <TypographyMuted className="text-xs font-medium leading-none text-foreground/75">
        {props.label}
      </TypographyMuted>
    </div>
  );
}
