import { StaticImageData } from "next/image";

export interface ISocialButtonProps {
    image: StaticImageData;
    label: string;
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    className?: string,
}