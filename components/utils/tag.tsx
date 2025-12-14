import { TypographyMuted } from "./typography/typography-muted";
import { ITagInterface } from "@/utils/interfaces/tag.interface";
import { getRandomBadgeColor } from "@/utils/extensions/get-random-badge-color";

export default function Tag(props: ITagInterface) {
  const { bg, text } = getRandomBadgeColor(props.label);

  return (
    <div
      className={`w-fit flex items-center ${
        props.icon ? "gap-1 py-[6px]" : "py-2"
      } px-3 rounded-2xl cursor-pointer ${bg}`}
    >
      {props.icon && (
        <span className={`${text} [&>svg]:!size-5`}>{props.icon}</span>
      )}
      <TypographyMuted className={`text-xs ${text} font-medium`}>
        {props.label}
      </TypographyMuted>
    </div>
  );
}
