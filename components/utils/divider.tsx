import { cn } from "@/lib/utils";
import { IDividerProps } from "@/utils/interfaces/divider.interface";

export default function Divider(props: IDividerProps) {
    return <div className={cn("w-full h-px bg-muted", props.className)}/>
} 