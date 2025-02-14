import { cn } from "@/lib/utils";
import { IWrapperProps } from "@/utils/interfaces/wrapper.interface";

export default function ColWrapper(props: IWrapperProps) {
    return (
        <div className={cn("flex flex-col justify-center items-center", props.className)}>
            {props.children}
        </div>
    )
}