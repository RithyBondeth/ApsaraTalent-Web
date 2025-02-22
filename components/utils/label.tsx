import { ILabelProps  } from "@/utils/interfaces/label.interface";
import { TypographyMuted } from "./typography/typography-muted";
import { cn } from "@/lib/utils";

export default function Label(props: ILabelProps) {
    return (
        <div className={cn("flex items-center gap-2", props.className)}> 
            {props.icon && props.icon}
            <TypographyMuted>{props.text}</TypographyMuted>
        </div>
    )
}