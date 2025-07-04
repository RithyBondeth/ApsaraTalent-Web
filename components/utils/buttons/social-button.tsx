import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ISocialButtonProps } from "@/utils/interfaces/social-button.interface";
import Image from "next/image";

export default function SocialButton(props: ISocialButtonProps) {
    return (
        <Button type="button" variant={props.variant} className={cn(props.className, "py-6 rounded-md")} onClick={props.onClick}>
            <Image src={props.image} alt="social" height={30} width={30} className="rounded-full"/>
            <p>{props.label}</p>
        </Button>
    )
}