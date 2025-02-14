import { cn } from "@/lib/utils";
import { IWrapperProps } from "@/utils/interfaces/wrapper.interface";

export default function FullWrapper(props: IWrapperProps) {
    return (
        <div className={cn("w-full h-full", props.className)}>
            {props.children}
        </div>
    )
}