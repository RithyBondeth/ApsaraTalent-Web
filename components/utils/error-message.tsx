import { IErrorMessageProps } from "@/utils/interfaces/error-message.interface";
import { TypographySmall } from "./typography/typography-small";
import { cn } from "@/lib/utils";

export default function ErrorMessage(props: IErrorMessageProps) {
    return (
        <TypographySmall className={cn('text-xs text-red-500', props.className)}>
            {props.children}
        </TypographySmall>
    )   
}