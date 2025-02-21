import { TypographyMuted } from "./typography/typography-muted";
import { ITagInterface } from "@/utils/interfaces/tag.interface";
export default function Tag(props: ITagInterface) {
    return (
        <div className="w-fit flex items-center px-3 py-2 rounded-2xl bg-muted cursor-pointer">
            <TypographyMuted className="text-xs">{props.label}</TypographyMuted>
        </div>
    )
}