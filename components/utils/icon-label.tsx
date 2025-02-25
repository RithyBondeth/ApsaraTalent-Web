import { ILabelProps  } from "@/utils/interfaces/label.interface";
import { TypographyMuted } from "./typography/typography-muted";
import { cn } from "@/lib/utils";

export default function IconLabel(props: ILabelProps) {
    return (
        <div className={cn("flex items-center gap-2", props.className)}> 
            {props.icon && <span className="[&>svg]:!size-5">{props.icon}</span>}
            <TypographyMuted>{props.text}</TypographyMuted>
        </div>
    )
}