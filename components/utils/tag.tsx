import { TypographyMuted } from "./typography/typography-muted";
import { ITagInterface } from "@/utils/interfaces/tag.interface";
export default function Tag(props: ITagInterface) {
    return (
        <div className={`w-fit flex items-center ${props.icon ? 'gap-1 py-[6px]' : 'py-2'} px-3 rounded-2xl bg-muted cursor-pointer [&>svg]:!size-5 [&>svg]:text-muted-foreground`}>
            {props.icon && props.icon}
            <TypographyMuted className="text-xs">{props.label}</TypographyMuted>
        </div>
    )
}