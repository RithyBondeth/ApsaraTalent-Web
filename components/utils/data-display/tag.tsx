import { getRandomBadgeColor } from "@/utils/functions/get-random-badge-color";
import { TypographyMuted } from "@/components/utils/typography/typography-muted";

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
      {props.icon && (
        <span className={`${text} [&>svg]:!size-4`}>{props.icon}</span>
      )}
      <TypographyMuted className={`text-xs ${text} font-medium leading-none`}>
        {props.label}
      </TypographyMuted>
    </div>
  );
}
