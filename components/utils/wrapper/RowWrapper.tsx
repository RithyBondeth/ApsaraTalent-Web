import { cn } from "@/lib/utils";
import { IWrapperProps } from "@/utils/interfaces/wrapper.interface";

export default function RowWrapper(props: IWrapperProps) {
    return (
        <div className={cn("flex justify-center items-center", props.className)}>
            {props.children}
        </div>
    )
}