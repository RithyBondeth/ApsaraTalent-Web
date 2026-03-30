import { getRandomBadgeColor } from "@/utils/functions/ui";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

/* ----------------------------------- Helper ---------------------------------- */
interface ITagInterface {
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Tag(props: ITagInterface) {
  /* ---------------------------------- Utils --------------------------------- */
  const { bg, text } = getRandomBadgeColor(props.label);

  /* -------------------------------- Render UI -------------------------------- */
  return (
    <div
      className={`w-fit flex items-center ${
        props.icon ? "gap-1 py-1.5" : "py-1.5"
      } px-3 rounded-full cursor-pointer transition-all duration-200 ease-out hover:scale-[1.04] hover:shadow-sm active:scale-95 ${bg} ${props.className ?? ""}`}
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
