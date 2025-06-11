import React from "react";
import { Label } from "./label";
import { RadioGroupItem } from "./radio-group";
import { cn } from "@/lib/utils";

type TRadioGroupItemWithLabelProps = {
    value: string;
    id: string;   
    htmlFor: string;
    children: React.ReactNode,
    className?: string
}

export default function RadioGroupItemWithLabel(props: TRadioGroupItemWithLabelProps) {
    return (
        <div className={cn("flex items-center gap-2", props.className)}>
            <RadioGroupItem value={props.value} id={props.id} />
            <Label htmlFor={props.htmlFor} className="font-normal">{props.children}</Label>
        </div>
    )   
}