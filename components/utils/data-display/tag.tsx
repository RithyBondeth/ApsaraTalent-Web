import { getRandomBadgeColor } from "@/utils/functions/ui";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/* ----------------------------------- Helper --------------------------------- */
interface ITagInterface {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  neutral?: boolean;
}

export default function Tag(props: ITagInterface) {
  /* ---------------------------------- Utils --------------------------------- */
  const { bg, text } = props.neutral
    ? { bg: "bg-muted/50", text: "text-foreground/75" }
    : getRandomBadgeColor(props.label);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={`flex w-fit items-center ${
        props.icon ? "gap-1 py-1.5" : "py-1.5"
      } pixel-wash cursor-pointer border border-border/60 px-3 hover:border-foreground/30 ${bg} ${props.className ?? ""}`}
    >
      {/* Icon Section */}
      {props.icon && (
        <span className={`${text} [&>svg]:!size-4`}>{props.icon}</span>
      )}

      {/* Label Section */}
      <TypographyMuted className={`text-xs ${text} font-medium leading-none`}>
        {props.label}
      </TypographyMuted>
    </div>
  );
}
